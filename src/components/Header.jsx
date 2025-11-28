import React from 'react';
import { Link } from 'react-router-dom'; // Router için gerekli link bileşeni

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-lg shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Sol Taraf: Logo ve Menü */}
          <div className="flex items-center gap-8">
            {/* Logo - Ana sayfaya yönlendirir */}
            <Link to="/" className="flex items-center gap-2 text-text-light dark:text-text-dark hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary text-3xl">explore</span>
              <h2 className="text-2xl font-bold">Gezify</h2>
            </Link>

            {/* Navigasyon Linkleri */}
            <nav className="hidden md:flex items-center gap-8 text-text-light dark:text-text-dark">
              <Link to="/" className="text-base font-medium hover:text-primary transition-colors">
                Ana Sayfa
              </Link>
              <Link to="/rotalar" className="text-base font-medium hover:text-primary transition-colors">
                Rotalar
              </Link>
              <Link to="/blog" className="text-base font-medium hover:text-primary transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* Orta Kısım: Arama Çubuğu */}
          <div className="hidden sm:flex flex-1 justify-center px-8 lg:px-12">
            <div className="w-full max-w-lg relative group">
              <label htmlFor="search" className="sr-only">Arama</label>
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input 
                id="search"
                name="search"
                className="w-full rounded-full border-none bg-background-light dark:bg-background-dark h-12 pl-12 pr-4 text-base font-normal text-text-light dark:text-text-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" 
                placeholder="Şehir, rota veya aktivite ara..." 
                type="search"
              />
            </div>
          </div>

          {/* Sağ Taraf: Profil İkonu */}
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-full h-12 w-12 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;