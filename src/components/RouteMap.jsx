// src/components/RouteMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { calculateOptimalRoute } from '../services/routeService';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });

// ═══════ İKON FABRİKALARI ═══════

// Orijinal POI ikonu + üstünde küçük sıra numarası badge
const createPOIIconWithBadge = (emoji, color, orderNumber) => {
  const size = 36;
  const badgeHTML = orderNumber != null ? `
    <div style="
      position: absolute; top: -6px; right: -6px;
      width: 20px; height: 20px;
      background: linear-gradient(135deg, #0EA5E9, #0284C7);
      border: 2px solid white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 900; color: white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      font-family: 'Inter', sans-serif;
      z-index: 10;
    ">${orderNumber}</div>` : '';

  return L.divIcon({
    html: `<div style="position: relative; width: ${size}px; height: ${size}px;">
      ${badgeHTML}
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px;
        box-shadow: 0 0 0 4px rgba(14,165,233,0.3), 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      ">${emoji}</div>
    </div>`,
    className: 'custom-poi-icon',
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -(size + 8) / 2 - 2]
  });
};

const startMarkerIcon = L.divIcon({
  html: `<div style="
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #10B981, #059669);
    border: 3px solid white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 900; color: white;
    box-shadow: 0 0 0 4px rgba(16,185,129,0.3), 0 3px 12px rgba(0,0,0,0.35);
    font-family: 'Inter', sans-serif;
  ">S</div>`,
  className: 'custom-poi-icon',
  iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -24]
});

const createModeIcon = (mode) => {
  const cfg = { driving: { emoji: '🚗', bg: '#0EA5E9' }, walking: { emoji: '🚶', bg: '#10B981' }, ferry: { emoji: '⛴️', bg: '#F59E0B' } }[mode] || { emoji: '🚗', bg: '#0EA5E9' };
  return L.divIcon({
    html: `<div style="width:24px;height:24px;background:${cfg.bg};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${cfg.emoji}</div>`,
    className: 'custom-poi-icon', iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14]
  });
};

const formatDuration = (seconds) => {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} dk`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} saat ${minutes} dk` : `${hours} saat`;
};

const placeStyles = {
  1:  { emoji: '🏰', color: '#8B5CF6' },  // Galata Kulesi
  2:  { emoji: '🕌', color: '#EF4444' },  // Ayasofya
  3:  { emoji: '🕌', color: '#3B82F6' },  // Sultanahmet Camii
  4:  { emoji: '🏛️', color: '#F59E0B' },  // Topkapı Sarayı
  5:  { emoji: '🛍️', color: '#10B981' },  // Kapalıçarşı
  6:  { emoji: '🗼', color: '#EC4899' },  // Kız Kulesi
  7:  { emoji: '🏰', color: '#6366F1' },  // Dolmabahçe Sarayı
  8:  { emoji: '⛲', color: '#14B8A6' },  // Yerebatan Sarnıcı
  9:  { emoji: '🏝️', color: '#F97316' },  // Büyükada
  10: { emoji: '🕌', color: '#D946EF' },  // Ortaköy Camii
  12: { emoji: '🏝️', color: '#22C55E' },  // Heybeliada
  13: { emoji: '🏙️', color: '#F43F5E' },  // Taksim Meydanı
};

const segmentStyles = {
  driving: { color: '#0EA5E9', shadow: '#075985', weight: 5, shadowW: 8, dash: null, op: 0.9, shadowOp: 0.25 },
  walking: { color: '#10B981', shadow: '#065F46', weight: 4, shadowW: 7, dash: '8, 12', op: 0.9, shadowOp: 0.2 },
  ferry:   { color: '#F59E0B', shadow: '#92400E', weight: 4, shadowW: 7, dash: '4, 10', op: 0.9, shadowOp: 0.2 },
};

// ═══════ HARİTA YARDIMCILARI ═══════

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) map.fitBounds(L.latLngBounds(positions), { padding: [60, 60], maxZoom: 15 });
  }, [positions, map]);
  return null;
};

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 13); }, [lat, lng, map]);
  return null;
};

// ═══════ ANA BİLEŞEN ═══════

const RouteMap = ({ selectedStops, showRoute, searchQuery, onSearchChange, onRouteCalculated, startTime }) => {
  const startLocation = { lat: 41.0256, lng: 28.9744, id: 'start', title: 'Başlangıç Noktası' };
  const [routeSegments, setRouteSegments] = useState([]);
  const [orderedStopIds, setOrderedStopIds] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const prevShowRouteRef = useRef(false);

  useEffect(() => {
    if (showRoute && selectedStops.length > 0) {
      let cancelled = false;
      const compute = async () => {
        setIsCalculating(true);
        try {
          const result = await calculateOptimalRoute(startLocation, selectedStops, startTime);
          if (cancelled) return;
          setRouteSegments(result.segments);
          setOrderedStopIds(result.orderedStops.map(s => s.id));
          if (onRouteCalculated) {
            onRouteCalculated({ orderedStops: result.orderedStops, segments: result.segments, distance: result.totalDistance, duration: result.totalDuration });
          }
        } catch (e) { console.error('Rota hatası:', e); }
        finally { if (!cancelled) setIsCalculating(false); }
      };
      compute();
      return () => { cancelled = true; };
    }
    if (!showRoute) { setRouteSegments([]); setOrderedStopIds([]); }
  }, [showRoute, startTime]);

  const getStopOrder = (stopId) => { const idx = orderedStopIds.indexOf(stopId); return idx >= 0 ? idx + 1 : null; };
  const allRoutePositions = routeSegments.flatMap(seg => seg.geometry);

  return (
    <div className="h-full w-full relative z-0">
      {/* ARAMA */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
          <input type="text" placeholder="Durak eklemek için lokasyon ara..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
        </div>
      </div>

      {/* LEJAND */}
      {routeSegments.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 px-3 py-2 flex gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-5 h-[3px] bg-[#0EA5E9] rounded-full inline-block"></span>🚗 Araç</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-[3px] rounded-full inline-block" style={{ background: 'repeating-linear-gradient(90deg, #10B981 0, #10B981 4px, transparent 4px, transparent 8px)' }}></span>🚶 Yürüme</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-[3px] rounded-full inline-block" style={{ background: 'repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 3px, transparent 3px, transparent 7px)' }}></span>⛴️ Feribot</span>
        </div>
      )}

      {/* LOADING */}
      {isCalculating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-gray-600">Rota hesaplanıyor...</span>
          </div>
        </div>
      )}

      <MapContainer center={[startLocation.lat, startLocation.lng]} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%", minHeight: "400px" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {allRoutePositions.length > 0 && <FitBounds positions={allRoutePositions} />}
        {routeSegments.length === 0 && selectedStops.length > 0 && <RecenterAutomatically lat={selectedStops[selectedStops.length - 1].lat} lng={selectedStops[selectedStops.length - 1].lng} />}

        {/* BAŞLANGIÇ */}
        <Marker position={[startLocation.lat, startLocation.lng]} icon={startMarkerIcon} zIndexOffset={1000}>
          <Popup><div style={{ textAlign: 'center' }}><b>📍 Başlangıç Noktası</b></div></Popup>
        </Marker>

        {/* DURAKLAR — Orijinal emoji ikon + üstte numara badge */}
        {selectedStops.map((stop) => {
          const order = getStopOrder(stop.id);
          const style = placeStyles[stop.id] || { emoji: '📍', color: '#6B7280' };
          const markerIcon = createPOIIconWithBadge(style.emoji, style.color, order);
          return (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={markerIcon} zIndexOffset={500}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  <b style={{ fontSize: '14px' }}>{style.emoji} {stop.title}</b><br />
                  {order ? <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: 600 }}>{order}. Durak</span>
                    : <span style={{ fontSize: '12px', color: '#6B7280' }}>{stop.desc}</span>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* SEGMENT POLYLINE'LAR */}
        {routeSegments.map((seg, idx) => {
          const subs = seg.subSegments || [seg];
          return subs.map((sub, sidx) => {
            const st = segmentStyles[sub.mode] || segmentStyles.driving;
            return (
              <React.Fragment key={`seg-${idx}-${sidx}`}>
                <Polyline positions={sub.geometry} color={st.shadow} weight={st.shadowW} opacity={st.shadowOp} lineCap="round" lineJoin="round" dashArray={st.dash} />
                <Polyline positions={sub.geometry} color={st.color} weight={st.weight} opacity={st.op} lineCap="round" lineJoin="round" dashArray={st.dash} />
              </React.Fragment>
            );
          });
        })}

        {/* MOD İKONLARI (segment ortası) */}
        {routeSegments.map((seg, idx) => {
          const subs = seg.subSegments || [seg];
          return subs.map((sub, sidx) => {
            const mid = sub.geometry[Math.floor(sub.geometry.length / 2)];
            if (!mid) return null;
            return (
              <Marker key={`mode-${idx}-${sidx}`} position={mid} icon={createModeIcon(sub.mode)} zIndexOffset={300}>
                <Popup>
                  <div style={{ textAlign: 'center', fontSize: '12px', minWidth: '100px' }}>
                    <b>{sub.fromTitle || seg.from.title} → {sub.toTitle || seg.to.title}</b><br />
                    {sub.mode === 'driving' ? '🚗 Araç' : sub.mode === 'walking' ? '🚶 Yürüme' : '⛴️ Vapur'}<br />
                    <span style={{ color: '#6B7280' }}>{(sub.distance / 1000).toFixed(1)} km · {formatDuration(sub.duration)}</span>
                  </div>
                </Popup>
              </Marker>
            );
          });
        })}
      </MapContainer>
    </div>
  );
};

export default RouteMap;