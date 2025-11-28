import React from 'react';

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-text-light dark:text-text-dark">
              <span className="material-symbols-outlined text-primary text-3xl">explore</span>
              <h2 className="text-2xl font-bold">Gezify</h2>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {/* İleride bu 'a' etiketleri React Router 'Link' bileşenleri olacak */}
              <a className="text-base font-medium hover:text-primary transition-colors" href="#">Ana Sayfa</a>
              <a className="text-base font-medium hover:text-primary transition-colors" href="#">Rotalar</a>
              <a className="text-base font-medium hover:text-primary transition-colors" href="#">Blog</a>
            </nav>
          </div>
          <div className="flex flex-1 justify-center px-8 lg:px-12">
            <div className="w-full max-w-lg">
              <label className="relative text-gray-400 focus-within:text-gray-600 block">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-2xl">search</span>
                <input 
                  className="form-input w-full rounded-full border-none bg-background-light dark:bg-background-dark h-12 pl-12 pr-4 text-base font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary" 
                  id="search" 
                  name="search" 
                  placeholder="Şehir, rota veya aktivite ara..." 
                  type="search"
                />
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-full h-12 w-12 bg-background-light dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;