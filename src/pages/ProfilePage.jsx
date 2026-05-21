import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, register, getCurrentUser, logout } from '../services/authService';
import { supabase } from '../services/supabaseClient';

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`material-symbols-outlined text-base ${rating >= star ? 'text-amber-400' : 'text-gray-300'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
  );
};

const ProfileDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'hesabim');

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };
  const [name, setName] = useState(user.name || '');
  const [email] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState(null);

  const [myRoutes, setMyRoutes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (activeTab === 'rotalarim') fetchMyRoutes();
    if (activeTab === 'begendigim') fetchFavorites();
    if (activeTab === 'degerlendirmelerim') fetchRatings();
  }, [activeTab]);

  const fetchMyRoutes = async () => {
    setLoading(true);
    const userId = parseInt(user.id, 10);
    const { data } = await supabase.from('routes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setMyRoutes(data);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    setLoading(true);
    const userId = parseInt(user.id, 10);
    const { data } = await supabase.from('user_favorites').select('*, city_routes(*)').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setFavorites(data);
    setLoading(false);
  };

  const fetchRatings = async () => {
    setLoading(true);
    const userId = parseInt(user.id, 10);
    const { data } = await supabase.from('user_ratings').select('*, city_routes(*)').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setRatings(data);
    setLoading(false);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showToast('Yeni şifreler eşleşmiyor.', 'error');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      showToast('Yeni şifre en az 6 karakter olmalıdır.', 'error');
      return;
    }
    try {
      const payload = { id: user.id, name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const res = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Güncelleme başarısız.');

      const storage = localStorage.getItem('gezify_user') ? localStorage : sessionStorage;
      storage.setItem('gezify_user', JSON.stringify({ ...user, name }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Profil başarıyla güncellendi!');
    } catch (err) {
      showToast(err.message || 'Güncelleme başarısız.', 'error');
    }
  };

  const tabs = [
    { id: 'hesabim', label: 'Hesabım', icon: 'person' },
    { id: 'degerlendirmelerim', label: 'Değerlendirmelerim / Yorumlarım', icon: 'star' },
    { id: 'rotalarim', label: 'Rotalarım', icon: 'route' },
    { id: 'begendigim', label: 'Beğendiğim Rotalar ve Öneriler', icon: 'favorite' },
    { id: 'gezify_plus', label: 'Gezify Plus', icon: 'workspace_premium', badge: 'Yeni' },
    { id: 'gezify_asistan', label: 'Gezify Asistan', icon: 'smart_toy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] font-display flex flex-col">
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl border text-sm font-semibold flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          <span className="material-symbols-outlined text-xl">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-base">explore</span>
          </div>
          Gezify
        </Link>
      </header>

      <div className="flex flex-1 max-w-6xl w-full mx-auto py-8 px-4 gap-8">

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm sticky top-24">

            {/* User Profile Summary */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-sky-50/50 dark:bg-sky-900/10">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/30">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-primary truncate">{user.email}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="p-2 flex flex-col gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                    ${activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  <span className={`material-symbols-outlined text-[20px] ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  <span className="flex-1 truncate">{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-4"></div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#1a1b1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 min-h-[500px]">

          {/* HESABIM TAB */}
          {activeTab === 'hesabim' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Hesabım</h2>
              <form onSubmit={handleUpdateAccount} className="max-w-md space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Ad Soyad</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
                  <input type="email" value={email} disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Email adresi değiştirilemez.</p>
                </div>
                {/* Şifre Değiştirme */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">Şifre Değiştir</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Mevcut Şifre</label>
                    <input type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Yeni Şifre</label>
                      <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Yeni Şifre (Tekrar)</label>
                      <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.</p>
                </div>
                <button type="submit" className="px-8 py-3 bg-primary hover:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all mt-4">
                  Değişiklikleri Kaydet
                </button>
              </form>
            </div>
          )}

          {/* DEĞERLENDİRMELERİM / YORUMLARIM TAB */}
          {activeTab === 'degerlendirmelerim' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Değerlendirmelerim / Yorumlarım</h2>
              <p className="text-sm text-gray-400 mb-6">Beğendiğin rotalar için verdiğin puanlar ve yorumlar burada listelenir.</p>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : ratings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-gray-700 mb-3">rate_review</span>
                  <p className="text-gray-500 font-medium">Henüz bir rota değerlendirmediniz.</p>
                  <p className="text-gray-400 text-sm mt-1">Ana sayfadaki popüler şehirlere tıklayarak rotaları puanlayabilirsiniz.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ratings.map(item => (
                    <div key={item.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:border-amber-300/50 transition-colors overflow-hidden">
                      {/* Üst: resim + başlık + yıldızlar */}
                      <div className="flex gap-4 p-4">
                        <img src={item.city_routes?.image_url} alt={item.city_routes?.title} className="w-20 h-20 rounded-xl object-cover shadow-sm flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{item.city_routes?.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 mb-3">{item.city_routes?.city}</p>
                          {/* Yıldız puanı — belirgin */}
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(star => (
                                <span key={star}
                                  className={`material-symbols-outlined text-xl ${(item.rating || 0) >= star ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >star</span>
                              ))}
                            </div>
                            <span className="text-sm font-bold text-amber-500">
                              {item.rating ? `${item.rating} / 5` : 'Puan yok'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Alt: yorum */}
                      {item.comment ? (
                        <div className="mx-4 mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex gap-2">
                          <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">chat_bubble</span>
                          <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">"{item.comment}"</p>
                        </div>
                      ) : (
                        <div className="mx-4 mb-4 px-3 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-400 italic">Henüz yorum yapılmadı — şehre tıklayıp rota kartından yorum ekleyebilirsiniz.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* ROTALARIM TAB */}
          {activeTab === 'rotalarim' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Oluşturduğum Rotalar</h2>
                <Link to="/yeni-rota" className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Yeni Rota
                </Link>
              </div>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : myRoutes.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><span className="material-symbols-outlined text-4xl mb-2 opacity-50">route</span><p>Henüz kendi rotanızı oluşturmadınız.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRoutes.map(route => {
                    const thumb = route.route_info?.selectedStops?.[0]?.image || '/images/default_route.jpg';
                    return (
                      <div key={route.id} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:border-primary/30 transition-colors">
                        <img src={thumb} alt={route.title} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1 truncate">{route.title}</h4>
                          <p className="text-[11px] text-gray-500 mb-2 truncate">{route.description || 'Açıklama yok'}</p>
                          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{route.planned_date || 'Tarihsiz'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* BEĞENDİĞİM ROTALAR TAB */}
          {activeTab === 'begendigim' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Beğendiğim Rotalar</h2>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><span className="material-symbols-outlined text-4xl mb-2 opacity-50">favorite</span><p>Henüz favori rotanız bulunmuyor.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:border-red-400/30 transition-colors">
                      <img src={item.city_routes.image_url} alt={item.city_routes.title} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1 truncate">{item.city_routes.title}</h4>
                          <span className="material-symbols-outlined text-red-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2 truncate">{item.city_routes.city}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{item.city_routes.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DİĞER TABLAR (Gezify Plus, Asistan) */}
          {(activeTab === 'gezify_plus' || activeTab === 'gezify_asistan') && (
            <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-800 mb-4">
                {activeTab === 'gezify_plus' ? 'workspace_premium' : 'smart_toy'}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Çok Yakında!</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {activeTab === 'gezify_plus' ? 'Gezify Plus ayrıcalıklarıyla seyahatlerinizi bir üst seviyeye taşıyın.' : 'Yapay zeka destekli seyahat asistanınızla kusursuz planlar yapın.'}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ─── GİRİŞ / KAYIT FORMU ────────────────────────────────────────────────────
const AuthForm = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setMessage({ type: 'error', text: 'Sosyal medya ile giriş başarısız.' });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { setMessage({ type: 'error', text: 'Email ve şifre zorunludur.' }); return; }
    setLoading(true);
    try {
      const data = await login(loginEmail, loginPassword, rememberMe);
      onLoginSuccess(data.user);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regPasswordConfirm) { setMessage({ type: 'error', text: 'Tüm alanları doldurunuz.' }); return; }
    if (regPassword !== regPasswordConfirm) { setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' }); return; }
    if (regPassword.length < 6) { setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' }); return; }
    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      setLoginEmail(regEmail);
      setActiveTab('login');
      setMessage({ type: 'success', text: 'Hesap oluşturuldu! Giriş yapabilirsiniz.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400 dark:text-white";

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/family_roadtrip_route.png')" }}>
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all border border-white/20 z-20 shadow-lg">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="font-medium text-sm">Ana Sayfa</span>
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="flex h-full w-full items-end p-12 relative z-10">
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">Discover Turkey's Hidden Gems</h1>
            <p className="mt-4 text-xl drop-shadow-md text-gray-100">Your next adventure awaits. Join Gezify to explore the best of Turkey.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-lg">
          <header className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">explore</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Gezify</h2>
          </header>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-4xl font-black tracking-tight text-gray-800 dark:text-white">
                {activeTab === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
                {activeTab === 'login' ? 'Plan Your Turkish Adventure' : 'Gezify ailesine katılın'}
              </p>
            </div>

            <div className="flex h-12 items-center justify-center rounded-xl bg-primary/10 p-1 gap-1">
              {['login', 'register'].map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setMessage(null); }}
                  className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              ))}
            </div>

            {message && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                <span className="material-symbols-outlined text-lg">{message.type === 'error' ? 'error' : 'check_circle'}</span>
                {message.text}
              </div>
            )}

            {activeTab === 'login' ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email</label>
                  <input type="email" placeholder="Email adresinizi girin" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputCls} disabled={loading} /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">Şifre</label>
                  <input type="password" placeholder="Şifrenizi girin" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={inputCls} disabled={loading} /></div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">Beni Hatırla</span>
                  </label>
                  <a href="#" className="text-primary font-medium hover:underline">Şifremi Unuttum</a>
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-sky-600 text-white rounded-xl font-bold text-base transition-all disabled:opacity-60 shadow-md shadow-primary/20">
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">Ad Soyad</label>
                  <input type="text" placeholder="Adınızı ve soyadınızı girin" value={regName} onChange={e => setRegName(e.target.value)} className={inputCls} disabled={loading} /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email</label>
                  <input type="email" placeholder="Email adresinizi girin" value={regEmail} onChange={e => setRegEmail(e.target.value)} className={inputCls} disabled={loading} /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">Şifre</label>
                  <input type="password" placeholder="En az 6 karakter" value={regPassword} onChange={e => setRegPassword(e.target.value)} className={inputCls} disabled={loading} /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">Şifre Tekrar</label>
                  <input type="password" placeholder="Şifrenizi tekrar girin" value={regPasswordConfirm} onChange={e => setRegPasswordConfirm(e.target.value)} className={inputCls} disabled={loading} /></div>
                <button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-sky-600 text-white rounded-xl font-bold text-base transition-all disabled:opacity-60 shadow-md shadow-primary/20">
                  {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                </button>
              </form>
            )}

            <div className="flex items-center my-1">
              <hr className="flex-grow border-gray-200 dark:border-gray-700" />
              <span className="mx-4 text-sm text-gray-400">veya şununla devam et</span>
              <hr className="flex-grow border-gray-200 dark:border-gray-700" />
            </div>

            <div className="flex justify-center gap-4">
              <a href="http://localhost:3001/auth/google" className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#4285F4] hover:shadow-lg transition-all hover:scale-105">
                <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              </a>
              <a href="http://localhost:3001/auth/facebook" className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#1877F2] hover:shadow-lg transition-all hover:scale-105">
                <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ANA BİLEŞEN ────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    navigate('/');
  };

  if (user) return <ProfileDashboard user={user} onLogout={handleLogout} />;
  return <AuthForm onLoginSuccess={handleLoginSuccess} />;
};

export default ProfilePage;
