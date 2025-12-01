// src/components/RouteMap.jsx

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css'; 
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// --- İKON DÜZELTMESİ ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Özel Kırmızı İkon (Başlangıç Konumu)
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- YARDIMCI FONKSİYONLAR ---
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateOptimizedRoute(startPoint, stops) {
  if (stops.length === 0) return [startPoint];

  let currentPoint = startPoint;
  let unvisitedStops = [...stops];
  let optimizedPath = [startPoint];

  while (unvisitedStops.length > 0) {
    let nearestStopIndex = -1;
    let minDistance = Infinity;

    unvisitedStops.forEach((stop, index) => {
      const dist = getDistance(currentPoint.lat, currentPoint.lng, stop.lat, stop.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestStopIndex = index;
      }
    });

    const nearestStop = unvisitedStops[nearestStopIndex];
    optimizedPath.push(nearestStop);
    currentPoint = nearestStop;
    unvisitedStops.splice(nearestStopIndex, 1);
  }

  return optimizedPath;
}

// Harita odağını değiştirmek için yardımcı bileşen
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

const RouteMap = ({ selectedStops, showRoute }) => {
  // Başlangıç: Galata Kulesi Civarı
  const startLocation = { lat: 41.0256, lng: 28.9744, id: 'start', title: 'Başlangıç Noktası' };
  
  const [routePath, setRoutePath] = useState([]);

  // showRoute prop'u true olduğunda rotayı hesapla
  useEffect(() => {
    if (showRoute && selectedStops.length > 0) {
      const optimized = calculateOptimizedRoute(startLocation, selectedStops);
      setRoutePath(optimized);
    } else {
      setRoutePath([]); // Rota gösterilmesin denirse çizgiyi sil
    }
  }, [showRoute, selectedStops]);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[startLocation.lat, startLocation.lng]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
      >
        <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>
        {/* Haritayı son eklenen durağa odakla */}
        {selectedStops.length > 0 && (
           <RecenterAutomatically lat={selectedStops[selectedStops.length - 1].lat} lng={selectedStops[selectedStops.length - 1].lng} />
        )}

        {/* Başlangıç Noktası */}
        <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
          <Popup><b>{startLocation.title}</b></Popup>
        </Marker>

        {/* Seçilen Duraklar */}
        {selectedStops.map((stop, index) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]}>
            <Popup>
              <b>{stop.title}</b><br />Durak #{index + 1}
            </Popup>
          </Marker>
        ))}

        {/* Rota Çizgisi */}
        {routePath.length > 1 && (
          <Polyline 
            positions={routePath.map(p => [p.lat, p.lng])} 
            color="#0EA5E9" 
            weight={5} 
            opacity={0.8}
          />
        )}

      </MapContainer>
      
      {/* Bilgi Notu */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-card-dark p-3 rounded-lg shadow-lg z-[400] text-sm border border-gray-200 dark:border-gray-700">
        <p className="font-bold text-primary">Rota Planlayıcı</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          Aşağıdaki listeden yer seçerek haritaya ekleyin.
        </p>
        <div className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          Eklenen Durak: {selectedStops.length}
        </div>
      </div>
    </div>
  );
};

export default RouteMap;