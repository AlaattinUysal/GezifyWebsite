import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import RouteMap from '../components/RouteMap';
import { supabase } from '../services/supabaseClient';
import { getCurrentUser } from '../services/authService';

const modeLabels = { driving: '🚗 Araç', walking: '🚶 Yürüme', ferry: '⛴️ Vapur' };
const modeColors = { driving: '#0EA5E9', walking: '#10B981', ferry: '#F59E0B' };

const formatDuration = (seconds) => {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} dk`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} saat ${minutes} dk` : `${hours} saat`;
};

const CreateRoutePage = () => {
  const scrollRef = useRef(null);
  const [selectedStops, setSelectedStops] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeTitle, setRouteTitle] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [routeInfo, setRouteInfo] = useState(null);
  const [startTime, setStartTime] = useState('10:00');
  const [myRoutes, setMyRoutes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, routeId: null });
  const [plannedDate, setPlannedDate] = useState('');
  const currentUser = getCurrentUser();
  const [searchParams] = useSearchParams();

  // Takvimden gelince tarihi otomatik doldur
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) setPlannedDate(dateParam);
  }, []);

  // Her rota farklı bir thumbnail alır — indekse göre döngüsel seçim
  const routeThumbs = [
    '/route_thumbs/thumb1.png',
    '/route_thumbs/thumb2.png',
    '/route_thumbs/thumb3.png',
    '/route_thumbs/thumb4.png',
  ];
  const getRouteThumbnail = (index) => routeThumbs[index % routeThumbs.length];

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const handleRouteCalculated = (info) => { setRouteInfo(info); };

  const popularPlaces = [
    { id: 1,  title: "Galata Kulesi",     desc: "İstanbul'un simgesi.",               image: "/places/galata_kulesi.png",     lat: 41.0256, lng: 28.9741 },
    { id: 2,  title: "Ayasofya",          desc: "Tarihin ve mimarinin şaheseri.",      image: "/places/ayasofya.png",          lat: 41.0086, lng: 28.9802 },
    { id: 3,  title: "Sultanahmet Camii", desc: "Mavi Cami olarak bilinir.",           image: "/places/sultanahmet_camii.png", lat: 41.0054, lng: 28.9768 },
    { id: 4,  title: "Topkapı Sarayı",    desc: "Osmanlı İmparatorluğu'nun merkezi.", image: "/places/topkapi_sarayi.png",    lat: 41.0115, lng: 28.9833 },
    { id: 5,  title: "Kapalıçarşı",       desc: "Dünyanın en eski çarşılarından.",    image: "/places/kapalicarsi.png",       lat: 41.0107, lng: 28.9680 },
    { id: 6,  title: "Kız Kulesi",        desc: "Boğaz'ın incisi.",                   image: "/places/kiz_kulesi.png",        lat: 41.0211, lng: 29.0041 },
    { id: 7,  title: "Dolmabahçe Sarayı", desc: "Osmanlı'nın son sarayı.",            image: "/places/dolmabahce_sarayi.png", lat: 41.0391, lng: 29.0007 },
    { id: 8,  title: "Yerebatan Sarnıcı", desc: "Yeraltının gizemli dünyası.",        image: "/places/yerebatan_sarnici.png", lat: 41.0084, lng: 28.9779 },
    { id: 9,  title: "Büyükada",          desc: "Prens Adaları'nın en büyüğü.",       image: "/places/buyukada.png",          lat: 40.8724, lng: 29.1264 },
    { id: 10, title: "Ortaköy Camii",     desc: "Boğaz manzaralı ikonik cami.",       image: "/places/ortakoy_camii.png",     lat: 41.0475, lng: 29.0278 },
    { id: 12, title: "Heybeliada",        desc: "Yeşillik ve huzurun adresi.",        image: "/places/buyukada.png",          lat: 40.8761, lng: 29.0967 },
    { id: 13, title: "Taksim Meydanı",    desc: "İstanbul'un modern kalbi.",          image: "/places/galata_kulesi.png",     lat: 41.0369, lng: 28.9850 },
  ];

  const filteredPlaces = popularPlaces.filter(place =>
    place.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) current.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' });
  };

  const togglePlace = (place) => {
    const isSelected = selectedStops.find(stop => stop.id === place.id);
    if (isSelected) setSelectedStops(selectedStops.filter(stop => stop.id !== place.id));
    else setSelectedStops([...selectedStops, place]);
    setShowRoute(false);
    setRouteInfo(null);
  };

  const moveStop = (index, direction) => {
    const newStops = [...selectedStops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;
    [newStops[index], newStops[targetIndex]] = [newStops[targetIndex], newStops[index]];
    setSelectedStops(newStops);
    setShowRoute(false);
    setRouteInfo(null);
  };

  // Rota hesaplandıktan sonra gösterilecek durak listesi
  const displayStops = routeInfo?.orderedStops || selectedStops;

  // Rotaları getir
  React.useEffect(() => {
    if (currentUser) {
      fetchMyRoutes();
    }
  }, []);

  const fetchMyRoutes = async () => {
    if (!currentUser) return;
    const userId = parseInt(currentUser.id, 10);
    if (isNaN(userId)) { console.error('Geçersiz user id:', currentUser.id); return; }
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) { console.error('fetchMyRoutes error:', error); }
    if (!error && data) { setMyRoutes(data); }
  };

  const handleSaveRoute = async () => {
    if (!currentUser) {
      showToast("Rota kaydetmek için lütfen giriş yapın.", 'error');
      return;
    }
    if (!routeTitle.trim()) {
      showToast("Lütfen rota başlığı girin.", 'error');
      return;
    }
    if (selectedStops.length === 0) {
      showToast("Lütfen en az bir durak ekleyin.", 'error');
      return;
    }

    setIsSaving(true);
    const userId = parseInt(currentUser.id, 10);
    if (isNaN(userId)) {
      showToast('Kullanıcı kimliği geçersiz. Lütfen tekrar giriş yapın.', 'error');
      setIsSaving(false);
      return;
    }
    const routeData = {
      user_id: userId,
      title: routeTitle,
      description: routeDescription,
      start_time: startTime,
      planned_date: plannedDate || null,
      privacy,
      route_info: {
        selectedStops,
        routeInfo
      }
    };

    let responseError = null;

    if (editingRouteId) {
      // Mevcut rotayı güncelle
      const { error } = await supabase
        .from('routes')
        .update(routeData)
        .eq('id', editingRouteId);
      responseError = error;
    } else {
      // Yeni rota ekle
      const { error } = await supabase
        .from('routes')
        .insert([routeData]);
      responseError = error;
    }

    setIsSaving(false);

    if (responseError) {
      console.error('Supabase Error:', responseError);
      showToast(`Rota kaydedilemedi: ${responseError.message || responseError.code || 'Bilinmeyen hata'}`, 'error');
    } else {
      showToast(editingRouteId ? 'Rota başarıyla güncellendi!' : 'Rota başarıyla kaydedildi!');
      fetchMyRoutes();
    }
  };

  const createNewRoute = () => {
    setEditingRouteId(null);
    setRouteTitle('');
    setRouteDescription('');
    setSelectedStops([]);
    setRouteInfo(null);
    setStartTime('10:00');
    setPlannedDate('');
    setPrivacy('public');
    setShowRoute(false);
  };

  const deleteRoute = async (routeId) => {
    setConfirmModal({ visible: true, routeId });
  };

  const confirmDelete = async () => {
    const routeId = confirmModal.routeId;
    setConfirmModal({ visible: false, routeId: null });
    const { error } = await supabase.from('routes').delete().eq('id', routeId);
    if (!error) {
      showToast("Rota silindi.", "success");
      if (editingRouteId === routeId) createNewRoute();
      fetchMyRoutes();
    }
  };
  
  const loadRoute = (route) => {
    setEditingRouteId(route.id);
    setRouteTitle(route.title);
    setRouteDescription(route.description || '');
    setStartTime(route.start_time || '10:00');
    setPlannedDate(route.planned_date || '');
    setPrivacy(route.privacy || 'public');
    if(route.route_info) {
      setSelectedStops(route.route_info.selectedStops || []);
      setRouteInfo(route.route_info.routeInfo || null);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-background-dark font-display text-text-light dark:text-text-dark h-screen flex overflow-hidden relative">
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl border text-sm font-semibold flex items-center gap-2.5 whitespace-nowrap ${toast.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          <span className="material-symbols-outlined text-xl">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.message}
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmModal.visible && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-red-500">delete</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">Rotayı Sil</p>
                <p className="text-xs text-gray-500 mt-0.5">Bu rotayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setConfirmModal({ visible: false, routeId: null })} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Vazgeç</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SOL SIDEBAR ═══════════ */}
      <aside className="w-64 bg-white dark:bg-card-dark border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">explore</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Gezify</h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
            <span className="material-symbols-outlined text-xl">explore</span><span className="font-medium">Keşfet</span>
          </Link>
          <Link to="/yeni-rota" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
            <span className="material-symbols-outlined text-xl">route</span><span>Rotalarım</span>
          </Link>
          <div className="mt-1 mb-2 ml-4 border-l-2 border-gray-100 dark:border-gray-800 pl-3 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
            {myRoutes.length > 0 ? myRoutes.map((route, index) => {
              const thumb = getRouteThumbnail(index);
              const isSelected = editingRouteId === route.id;
              return (
                <div key={route.id} className={`flex items-center gap-3 group p-2 rounded-xl transition-all cursor-pointer border ${isSelected ? 'bg-primary/5 border-primary/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`} onClick={() => loadRoute(route)}>
                  <img src={thumb} alt="rota_resmi" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>{route.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{route.route_info?.selectedStops?.length || 0} durak</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <span className="material-symbols-outlined text-sm cursor-pointer hover:text-red-500 text-gray-400" onClick={(e) => { e.stopPropagation(); deleteRoute(route.id); }}>delete</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-[11px] text-gray-400 italic py-2">Henüz kayıtlı rotanız yok.</p>
            )}
          </div>

          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex-shrink-0">
            <span className="material-symbols-outlined text-xl">favorite</span><span className="font-medium">Favoriler</span>
          </Link>
          <Link to="/profil" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex-shrink-0">
            <span className="material-symbols-outlined text-xl">person</span><span className="font-medium">Profil</span>
          </Link>
        </nav>
        <div className="px-4 py-4 mt-auto border-t border-gray-100 dark:border-gray-800">
          <button onClick={createNewRoute} className="w-full py-2.5 bg-primary hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Yeni Rota Oluştur
          </button>
        </div>
      </aside>

      {/* ═══════════ ORTA — HARİTA + GALERİ ═══════════ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex justify-between items-end flex-shrink-0">
          <div>
            <h2 className="text-xl font-black tracking-tight">Yeni Rota Oluştur</h2>
            <p className="text-gray-500 text-xs mt-0.5">Haritaya tıklayarak veya arama yaparak durak ekleyin.</p>
          </div>
          <button
            onClick={() => setShowRoute(true)}
            disabled={selectedStops.length < 2}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white shadow transition-all hover:scale-105 flex-shrink-0 ${selectedStops.length < 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-sky-600'}`}
          >
            <span className="material-symbols-outlined text-base">alt_route</span>
            En Yakın Rotayı Hesapla
          </button>
        </div>

        <div className="flex-1 px-5 pb-2 min-h-0">
          <div className="relative w-full h-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-0">
            <RouteMap
              selectedStops={selectedStops}
              showRoute={showRoute}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRouteCalculated={handleRouteCalculated}
              startTime={startTime}
            />
          </div>
        </div>

        {/* Alt Galeri */}
        <div className="px-5 py-3 relative group flex-shrink-0">
          <button onClick={() => scroll('left')} className="absolute top-1/2 -translate-y-1/2 left-3 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-primary cursor-pointer text-sm">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 scroll-smooth no-scrollbar snap-x snap-mandatory">
            {filteredPlaces.map((place) => {
              const isSelected = selectedStops.find(stop => stop.id === place.id);
              return (
                <div key={place.id} onClick={() => togglePlace(place)}
                  className={`flex-none w-36 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/image relative snap-start shadow-sm transition-all duration-300 transform hover:-translate-y-1 border-2 ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={place.image} alt={place.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110" />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5 shadow-md z-20">
                      <span className="material-symbols-outlined text-xs font-bold">check</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                    <p className="text-white font-bold text-xs drop-shadow-md">{place.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => scroll('right')} className="absolute top-1/2 -translate-y-1/2 right-3 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-primary cursor-pointer text-sm">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </main>

      {/* ═══════════ SAĞ PANEL — ROTA DETAYLARI ═══════════ */}
      <aside className="w-72 bg-white dark:bg-card-dark border-l border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-5 flex flex-col gap-4 flex-1">

          {/* Rota Başlığı */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Rota Başlığı</label>
            <input type="text" placeholder="İstanbul'un Tarihi Yerleri" value={routeTitle} onChange={(e) => setRouteTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400" />
          </div>

          {/* Rota Başlangıç Saati */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Gezi Başlangıç Saati</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-700 dark:text-gray-300" />
            <p className="text-[10px] text-gray-400 mt-1">Rota süresi, bu saatteki tahmini trafiğe göre optimize edilir.</p>
          </div>

          {/* Gezi Tarihi */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Gezi Tarihi (opsiyonel)</label>
            <input
              type="date"
              value={plannedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setPlannedDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-700 dark:text-gray-300"
            />
            <p className="text-[10px] text-gray-400 mt-1">Takviminizde bu tarihe atanmış rota olarak görünür.</p>
          </div>

          {/* Rota Açıklaması */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Rota Açıklaması</label>
            <textarea placeholder="İstanbul'un kalbinde, tarihin ve kültürün iç içe geçtiği eşsiz bir yolculuk..." value={routeDescription} onChange={(e) => setRouteDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder-gray-400" />
          </div>

          {/* Rota Bilgisi */}
          {routeInfo && (
            <div className="bg-gradient-to-r from-primary/10 to-sky-100/50 dark:from-primary/20 dark:to-sky-900/20 rounded-xl p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-base">route</span>
                <span className="text-xs font-bold text-primary">Rota Hesaplandı</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-500">Toplam Mesafe</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{(routeInfo.distance / 1000).toFixed(1)} km</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-500">Tahmini Süre</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatDuration(routeInfo.duration)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ ADIM ADIM ROTA REHBERİ ═══════ */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
              {routeInfo?.segments ? 'Rota Adımları' : 'Duraklar'}
            </label>

            {displayStops.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center text-gray-400 text-xs">
                <span className="material-symbols-outlined text-2xl mb-1 block opacity-40">map</span>
                Henüz durak eklenmedi
              </div>
            ) : routeInfo?.segments ? (
              /* ══ HESAPLANMIŞ ROTA — Adım adım ══ */
              <div className="space-y-0">
                {/* Başlangıç */}
                <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-black flex-shrink-0">S</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">Başlangıç Noktası</p>
                    <p className="text-[10px] text-gray-400">Mevcut konumunuz</p>
                  </div>
                </div>

                {routeInfo.segments.map((seg, idx) => {
                  const subs = seg.subSegments || [seg];
                  return (
                  <React.Fragment key={idx}>
                    {/* Segment bağlantı çizgisi */}
                    {subs.map((sub, sidx) => (
                      <div key={`sub-${sidx}`} className="flex items-center gap-2 py-1 pl-5">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-3 rounded-full" style={{ backgroundColor: modeColors[sub.mode] }}></div>
                          <div className="w-0.5 h-1 rounded-full" style={{ backgroundColor: modeColors[sub.mode], opacity: 0.4 }}></div>
                          <div className="w-0.5 h-3 rounded-full" style={{ backgroundColor: modeColors[sub.mode] }}></div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1 border border-gray-100 dark:border-gray-700">
                          <span className="text-[11px]">{modeLabels[sub.mode]}</span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {sub.toTitle ? `${sub.fromTitle} → ${sub.toTitle} ` : ''}
                            ({(sub.distance / 1000).toFixed(1)} km · {formatDuration(sub.duration)})
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Hedef durak */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-colors">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-black flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}>
                        {idx + 1}
                      </span>
                      {routeInfo.orderedStops[idx]?.image && (
                        <img src={routeInfo.orderedStops[idx].image} alt={seg.to.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{seg.to.title}</p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {routeInfo.orderedStops[idx]?.desc || ''}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                  );
                })}
              </div>
            ) : (
              /* ══ HENÜZ HESAPLANMAMIŞ — Basit liste ══ */
              <div className="space-y-2">
                {displayStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-primary/30 transition-colors">
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary text-white text-[10px] font-bold mt-0.5 flex-shrink-0">{index + 1}</span>
                    {stop.image && (
                      <img src={stop.image} alt={stop.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{stop.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{stop.desc || ''}</p>
                    </div>
                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveStop(index, 'up')} className="text-gray-400 hover:text-primary p-0.5" disabled={index === 0}>
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                      </button>
                      <button onClick={() => moveStop(index, 'down')} className="text-gray-400 hover:text-primary p-0.5" disabled={index === selectedStops.length - 1}>
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                      </button>
                    </div>
                    <button onClick={() => togglePlace(stop)} className="text-gray-400 hover:text-red-500 transition-colors p-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400 text-center mt-1">Durakları sürükleyerek sıralamayı değiştirin.</p>
              </div>
            )}
          </div>

          {/* Gizlilik Ayarları */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Gizlilik Ayarları</label>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${privacy === 'public' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                <input type="radio" name="privacy" value="public" checked={privacy === 'public'} onChange={() => setPrivacy('public')} className="mt-1 accent-primary" />
                <div>
                  <p className="text-xs font-semibold text-text-light dark:text-text-dark">Herkese Açık</p>
                  <p className="text-[10px] text-gray-400">Diğer gezginler bu rotayı görebilir.</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${privacy === 'private' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                <input type="radio" name="privacy" value="private" checked={privacy === 'private'} onChange={() => setPrivacy('private')} className="mt-1 accent-primary" />
                <div>
                  <p className="text-xs font-semibold text-text-light dark:text-text-dark">Gizli</p>
                  <p className="text-[10px] text-gray-400">Bu rota sadece sana özel.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
          <button 
            onClick={handleSaveRoute} 
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
            {isSaving ? 'Kaydediliyor...' : (editingRouteId ? 'Değişiklikleri Kaydet' : 'Kaydet')}
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-sky-600 text-white text-sm font-bold shadow-sm transition-colors">Yayınla</button>
        </div>
      </aside>
    </div>
  );
};

export default CreateRoutePage;