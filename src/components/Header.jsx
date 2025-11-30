// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 h-24 flex items-center">
      
      <div className="w-full px-6">
        <div className="flex items-center justify-between w-full">
          
          {/* --- SOL TARAFTAKİ BLOK (LOGO + MENÜ) --- */}
          <div className="flex items-center gap-12 flex-shrink-0">
            
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-4xl">explore</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Gezify</h2>
            </Link>

            {/* MENÜ LİNKLERİ */}
            <nav className="hidden md:flex items-center gap-8">
              {/* DÜZELTME: font-bold yerine font-medium kullandık */}
              <Link to="/" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">
                Ana Sayfa
              </Link>
              <Link to="/rotalar" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">
                Rotalar
              </Link>
              <Link to="/blog" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* --- ORTA KISIM (ARAMA ÇUBUĞU) --- */}
          {/* Blog ile Profil arasını eşit ortalar */}
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

          {/* --- SAĞ TARAF (PROFİL) --- */}
          <div className="flex-shrink-0">
            <button className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-gray-100 dark:border-gray-700 shadow-sm">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;