import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, register } from '../services/authService';

const ProfilePage = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  // ── Handlers ───────────────────────────────────────────────────────────────
  const clearMessage = () => setMessage(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      let errorText = 'Bilinmeyen bir hata oluştu.';
      if (errorParam === 'GoogleConfigEksik') {
        errorText = 'Google Giriş yapılamadı: API anahtarları eksik (.env dosyasına eklenmeli).';
      } else if (errorParam === 'FacebookConfigEksik') {
        errorText = 'Facebook Giriş yapılamadı: API anahtarları eksik (.env dosyasına eklenmeli).';
      } else if (errorParam === 'GoogleAuthFailed' || errorParam === 'FacebookAuthFailed') {
        errorText = 'Sosyal medya ile giriş yapılamadı veya reddedildi.';
      } else if (errorParam === 'ParseError') {
        errorText = 'Kullanıcı verisi alınırken hata oluştu.';
      }

      setMessage({ type: 'error', text: errorText });
      
      // Parametreyi URL'den temizle ki sayfayı yenileyince tekrar çıkmasın
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearMessage();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!loginEmail || !loginPassword) {
      setMessage({ type: 'error', text: 'Email ve şifre zorunludur.' });
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword, rememberMe);
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!regName || !regEmail || !regPassword || !regPasswordConfirm) {
      setMessage({ type: 'error', text: 'Tüm alanları doldurunuz.' });
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' });
      return;
    }

    if (regPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
      return;
    }

    setLoading(true);
    try {
      const data = await register(regName, regEmail, regPassword);
      setMessage({ type: 'success', text: 'Hesabınız oluşturuldu! Giriş yapabilirsiniz.' });
      // Register'dan sonra login tab'ına geç
      setTimeout(() => {
        setLoginEmail(regEmail);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegPasswordConfirm('');
        setActiveTab('login');
        setMessage({ type: 'success', text: 'Hesap oluşturuldu. Şimdi giriş yapabilirsiniz.' });
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen relative">
      {/* Sol Panel — Görsel */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/family_roadtrip_route.png')" }}
      >
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all border border-white/20 z-20 shadow-lg"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="font-medium text-sm">Ana Sayfa</span>
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="flex h-full w-full items-end p-12 relative z-10">
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
              Discover Turkey's Hidden Gems
            </h1>
            <p className="mt-4 text-xl drop-shadow-md text-gray-100">
              Your next adventure awaits. Join Gezify to explore the best of Turkey.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 select-none relative bg-background-light dark:bg-background-dark">
        {/* Mobil Geri Dön */}
        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-all shadow-sm border border-gray-200 dark:border-gray-700 z-10"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>

        <div className="w-full max-w-lg mt-12 sm:mt-0">
          {/* Logo */}
          <header className="flex items-center justify-start gap-4 text-[#0e1b0e] dark:text-white mb-8">
            <div className="size-10 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em]">Gezify</h2>
          </header>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-4xl font-black leading-tight tracking-[-0.033em]">
                {activeTab === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
              </p>
              <p className="text-base font-normal leading-normal text-[#509550] dark:text-gray-400 mt-2">
                {activeTab === 'login' ? 'Plan Your Turkish Adventure' : 'Gezify ailesine katılın'}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex h-14 flex-1 items-center justify-center rounded-xl bg-primary/20 dark:bg-primary/30 p-1">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-base font-medium leading-normal transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-background-light dark:bg-background-dark shadow-md text-[#0e1b0e] dark:text-white'
                    : 'text-[#509550] dark:text-gray-300'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('register')}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-base font-medium leading-normal transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'bg-background-light dark:bg-background-dark shadow-md text-[#0e1b0e] dark:text-white'
                    : 'text-[#509550] dark:text-gray-300'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Hata Mesajı */}
            {message && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700">
                <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
                {message.text}
              </div>
            )}

            {/* ── LOGIN FORMU ── */}
            {activeTab === 'login' && (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="flex flex-col">
                  <label className="text-base font-medium leading-normal pb-2" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email adresinizi girin"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-primary/20 dark:bg-primary/30 h-14 placeholder:text-[#509550] dark:placeholder:text-gray-400 px-5 text-base font-normal leading-normal cursor-text select-text"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base font-medium leading-normal pb-2" htmlFor="login-password">
                    Şifre
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Şifrenizi girin"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-primary/20 dark:bg-primary/30 h-14 placeholder:text-[#509550] dark:placeholder:text-gray-400 px-5 text-base font-normal leading-normal cursor-text select-text"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      className="form-checkbox h-5 w-5 rounded text-primary bg-primary/20 border-none focus:ring-primary cursor-pointer"
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="text-[#0e1b0e] dark:text-gray-300 cursor-pointer" htmlFor="remember-me">
                      Beni Hatırla
                    </label>
                  </div>
                  <a className="font-medium text-primary hover:underline" href="#">
                    Şifremi Unuttum
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-14 px-4 bg-primary text-[#0e1b0e] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                      Giriş yapılıyor...
                    </>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </form>
            )}

            {/* ── REGISTER FORMU ── */}
            {activeTab === 'register' && (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="flex flex-col">
                  <label className="text-base font-medium leading-normal pb-2" htmlFor="reg-name">
                    Ad Soyad
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Adınızı ve soyadınızı girin"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-primary/20 dark:bg-primary/30 h-14 placeholder:text-[#509550] dark:placeholder:text-gray-400 px-5 text-base font-normal leading-normal cursor-text select-text"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base font-medium leading-normal pb-2" htmlFor="reg-email">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="Email adresinizi girin"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-primary/20 dark:bg-primary/30 h-14 placeholder:text-[#509550] dark:placeholder:text-gray-400 px-5 text-base font-normal leading-normal cursor-text select-text"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base font-medium leading-normal pb-2" htmlFor="reg-password">
                    Şifre
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="En az 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-primary/20 dark:bg-primary/30 h-14 placeholder:text-[#509550] dark:placeholder:text-gray-400 px-5 text-base font-normal leading-normal cursor-text select-text"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base font-medium leading-normal pb-2" htmlFor="reg-password-confirm">
                    Şifre Tekrar
                  </label>
                  <input
                    id="reg-password-confirm"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-primary/20 dark:bg-primary/30 h-14 placeholder:text-[#509550] dark:placeholder:text-gray-400 px-5 text-base font-normal leading-normal cursor-text select-text"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-14 px-4 bg-primary text-[#0e1b0e] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Hesap Oluştur'
                  )}
                </button>
              </form>
            )}

            {/* Sosyal Giriş */}
            <div className="flex items-center my-2">
              <hr className="flex-grow border-t border-primary/30" />
              <span className="mx-4 text-sm text-[#509550] dark:text-gray-400">veya şununla devam et</span>
              <hr className="flex-grow border-t border-primary/30" />
            </div>

            <div className="flex justify-center gap-5">
              {/* Google */}
              <a
                href="http://localhost:3001/auth/google"
                id="google-login-btn"
                title="Google ile giriş yap"
                className="group flex items-center justify-center w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#4285F4] hover:shadow-lg hover:shadow-[#4285F4]/20 transition-all duration-200 hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="http://localhost:3001/auth/facebook"
                id="facebook-login-btn"
                title="Facebook ile giriş yap"
                className="group flex items-center justify-center w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/20 transition-all duration-200 hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
