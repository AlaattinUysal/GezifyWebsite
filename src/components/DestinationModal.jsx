// src/components/DestinationModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { getCurrentUser } from '../services/authService';

const StarRating = ({ rating, onRate, readOnly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          disabled={readOnly}
          onClick={() => !readOnly && onRate && onRate(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`text-xl transition-all ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
        >
          <span
            className={`material-symbols-outlined text-xl ${(hovered || rating) >= star ? 'text-amber-400' : 'text-gray-300'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
};

const DestinationModal = ({ destination, onClose }) => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [savedComments, setSavedComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const currentUser = getCurrentUser();

  const showToast = (msg, type = 'success', action = null) => {
    setToast({ msg, type, action });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!destination) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: routeData } = await supabase
        .from('city_routes')
        .select('*')
        .eq('city', destination.title)
        .limit(5);
      setRoutes(routeData || []);

      if (currentUser) {
        const userId = parseInt(currentUser.id, 10);
        const { data: favData } = await supabase
          .from('user_favorites')
          .select('city_route_id')
          .eq('user_id', userId);
        setFavorites(new Set((favData || []).map(f => f.city_route_id)));

        const { data: ratingData } = await supabase
          .from('user_ratings')
          .select('city_route_id, rating, comment')
          .eq('user_id', userId);
        const rMap = {};
        const cMap = {};
        (ratingData || []).forEach(r => {
          rMap[r.city_route_id] = r.rating;
          if (r.comment) cMap[r.city_route_id] = r.comment;
        });
        setRatings(rMap);
        setComments(cMap);
        setSavedComments(cMap);
      }
      setLoading(false);
    };
    fetchData();
  }, [destination?.title]);

  const toggleFavorite = async (routeId) => {
    if (!currentUser) { showToast('Beğenmek için giriş yapın.', 'error'); return; }
    const userId = parseInt(currentUser.id, 10);
    const isFav = favorites.has(routeId);
    if (isFav) {
      await supabase.from('user_favorites').delete()
        .eq('user_id', userId).eq('city_route_id', routeId);
      setFavorites(prev => { const s = new Set(prev); s.delete(routeId); return s; });
      showToast('Favorilerden çıkarıldı.');
    } else {
      await supabase.from('user_favorites').insert([{ user_id: userId, city_route_id: routeId }]);
      setFavorites(prev => new Set([...prev, routeId]));
      // Toast'ta "Favorilerime git" aksiyonu
      showToast('Favorilere eklendi! ❤️', 'success', 'go_favorites');
    }
  };

  const handleRate = async (routeId, rating) => {
    if (!currentUser) { showToast('Puan vermek için giriş yapın.', 'error'); return; }
    const userId = parseInt(currentUser.id, 10);
    const comment = comments[routeId] || null;
    await supabase.from('user_ratings').upsert(
      [{ user_id: userId, city_route_id: routeId, rating, comment }],
      { onConflict: 'user_id,city_route_id' }
    );
    setRatings(prev => ({ ...prev, [routeId]: rating }));
    showToast(`${rating} yıldız verdiniz! ⭐`);
  };

  const saveComment = async (routeId) => {
    if (!currentUser) { showToast('Yorum yapmak için giriş yapın.', 'error'); return; }
    const userId = parseInt(currentUser.id, 10);
    const rating = ratings[routeId] || 0;
    const comment = comments[routeId] || null;
    await supabase.from('user_ratings').upsert(
      [{ user_id: userId, city_route_id: routeId, rating, comment }],
      { onConflict: 'user_id,city_route_id' }
    );
    setSavedComments(prev => ({ ...prev, [routeId]: comment }));
    showToast('Yorumunuz kaydedildi! 💬');
  };

  const difficultyColor = {
    'Kolay': 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    'Orta': 'text-amber-600 bg-amber-50 border border-amber-200',
    'Zor': 'text-red-600 bg-red-50 border border-red-200',
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1a1b1e] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Toast */}
        {toast && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            <span className="material-symbols-outlined text-base">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            <span>{toast.msg}</span>
            {toast.action === 'go_favorites' && (
              <button
                onClick={() => { onClose(); navigate('/profil?tab=begendigim'); }}
                className="ml-1 underline text-emerald-700 font-bold hover:text-emerald-900 transition-colors whitespace-nowrap"
              >
                Favorilerime git →
              </button>
            )}
          </div>
        )}

        {/* Header */}
        <div className="relative h-48 flex-shrink-0">
          <img src={destination.image} alt={destination.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-3xl font-black drop-shadow-lg">{destination.title}</h2>
            <p className="text-sm text-white/80 mt-0.5">{routes.length} rota önerisi</p>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Routes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : routes.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Bu şehir için henüz rota eklenmemiş.</p>
          ) : routes.map(route => {
            const isFav = favorites.has(route.id);
            const myRating = ratings[route.id] || 0;
            return (
              <div key={route.id} className={`rounded-2xl p-4 border transition-all ${isFav ? 'border-red-200 bg-red-50/30 dark:bg-red-900/10' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary/20'}`}>
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={route.image_url} alt={route.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{route.title}</h3>
                      {/* Favori butonu — favori ise "Kaldır" da göster */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isFav && (
                          <button
                            onClick={() => toggleFavorite(route.id)}
                            title="Favorilerden kaldır"
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-lg transition-all whitespace-nowrap"
                          >
                            Kaldır
                          </button>
                        )}
                        <button
                          onClick={() => isFav ? navigate('/profil?tab=begendigim') : toggleFavorite(route.id)}
                          title={isFav ? 'Favorilerime git' : 'Favorilere ekle'}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isFav ? 'bg-red-100 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-400'}`}
                        >
                          <span className="material-symbols-outlined text-base"
                            style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                            favorite
                          </span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2 line-clamp-2">{route.description}</p>
                    {/* Stops */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(route.stops || []).slice(0, 4).map((stop, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">{stop}</span>
                      ))}
                      {(route.stops || []).length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-semibold rounded-full">+{route.stops.length - 4}</span>
                      )}
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColor[route.difficulty] || 'text-gray-500 bg-gray-100'}`}>
                        {route.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {route.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating + Comment */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Puanınız:</span>
                      {myRating > 0 && (
                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {myRating} / 5
                        </span>
                      )}
                    </div>
                    <StarRating rating={myRating} onRate={(r) => handleRate(route.id, r)} />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Bu rota hakkında ne düşünüyorsunuz?"
                      value={comments[route.id] || ''}
                      onChange={(e) => setComments(prev => ({ ...prev, [route.id]: e.target.value }))}
                      className="flex-1 text-xs px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:text-white"
                    />
                    <button
                      onClick={() => saveComment(route.id)}
                      disabled={comments[route.id] === savedComments[route.id]}
                      className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DestinationModal;
