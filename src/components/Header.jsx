// src/components/Header.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

const menuItems = [
  {
    id: 'hesabim',
    label: 'Hesabım',
    icon: 'manage_accounts',
    href: '/profil',
  },
  {
    id: 'degerlendirmelerim',
    label: 'Değerlendirmelerim',
    icon: 'star_rate',
    href: '/degerlendirmeler',
  },
  {
    id: 'rotalarim',
    label: 'Rotalarım',
    icon: 'route',
    href: '/rotalarim',
  },
  {
    id: 'begendiklerim',
    label: 'Beğendiğim Rotalar ve Öneriler',
    icon: 'favorite',
    href: '/begendiklerim',
  },
  { divider: true },
  {
    id: 'gezify-plus',
    label: 'Gezify Plus',
    icon: 'workspace_premium',
    href: '/plus',
    badge: 'Yeni',
    badgeColor: 'bg-primary text-white',
  },
  {
    id: 'gezify-asistan',
    label: 'Gezify Asistan',
    icon: 'smart_toy',
    href: '/asistan',
  },
  { divider: true },
  {
    id: 'cikis',
    label: 'Çıkış Yap',
    icon: 'logout',
    action: 'logout',
    danger: true,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  // Route değiştiğinde kullanıcıyı yenile
  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setDropdownOpen(false);
  }, [location.pathname]);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleProfileClick = () => {
    if (currentUser) {
      setDropdownOpen((prev) => !prev);
    } else {
      navigate('/profil');
    }
  };

  const handleMenuClick = (item) => {
    if (busy) return;
    setDropdownOpen(false);

    if (item.action === 'logout') {
      setBusy(true);
      timerRef.current = setTimeout(() => {
        logout();
        setCurrentUser(null);
        setBusy(false);
        navigate('/');
      }, 800);
    } else {
      // Çıkış yap dışındaki tüm linkler şimdilik sessizce hiçbir şey yapmıyor
    }
  };

  const getInitial = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 h-24 flex items-center">
      <div className="w-full px-6">
        <div className="flex items-center justify-between w-full">

          {/* --- SOL: LOGO + MENÜ --- */}
          <div className="flex items-center gap-12 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-4xl">explore</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Gezify</h2>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">
                Ana Sayfa
              </Link>
              <Link to="/yeni-rota" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">
                Rotalar
              </Link>
              <Link to="/blog" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* --- ORTA: ARAMA --- */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-3xl">
              <label htmlFor="search" className="sr-only">Arama</label>
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
                search
              </span>
              <input
                id="search"
                name="search"
                type="search"
                placeholder="Şehir, rota veya aktivite ara..."
                className="w-full h-14 pl-14 pr-6 rounded-full bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg text-gray-900 dark:text-white placeholder:text-gray-500 shadow-sm"
              />
            </div>
          </div>

          {/* --- SAĞ: PROFİL BUTONU + DROPDOWN --- */}
          <div className="flex-shrink-0 relative" ref={dropdownRef}>
            <button
              id="profile-btn"
              onClick={handleProfileClick}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={`flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 ${busy ? 'opacity-50 pointer-events-none' : ''}`}
              title={currentUser ? currentUser.name : 'Giriş Yap'}
            >
              {currentUser ? (
                <span className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-bold">
                  {getInitial(currentUser.name)}
                </span>
              ) : (
                <span className="material-symbols-outlined text-3xl">account_circle</span>
              )}
            </button>

            {/* ── DROPDOWN MENÜ ── */}
            {dropdownOpen && currentUser && (
              <div
                id="profile-dropdown"
                className="absolute right-0 top-[calc(100%+12px)] w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                style={{ animation: 'dropdownIn 0.18s ease-out' }}
              >
                {/* Kullanıcı Bilgisi */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5 dark:bg-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow">
                      {getInitial(currentUser.name)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-gray-900 dark:text-white text-base truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-sm text-primary truncate font-medium">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menü Öğeleri */}
                <ul className="py-2">
                  {menuItems.map((item, idx) => {
                    if (item.divider) {
                      return <li key={`div-${idx}`} className="my-1 border-t border-gray-100 dark:border-gray-800" />;
                    }
                    return (
                      <li key={item.id}>
                        <button
                          id={`menu-${item.id}`}
                          onClick={() => handleMenuClick(item)}
                          disabled={busy}
                          className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-colors group cursor-pointer select-none focus:outline-none
                            ${item.danger
                              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                            }`}
                        >
                          <span className={`material-symbols-outlined text-xl transition-colors
                            ${item.danger ? 'text-red-400' : 'text-gray-400 group-hover:text-primary'}`}>
                            {item.icon}
                          </span>
                          <span className="flex-1 font-medium">{item.label}</span>
                          {item.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
};

export default Header;