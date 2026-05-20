import React from 'react';
import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import DiscoveredRoutes from '../components/DiscoveredRoutes.jsx'; 
import MapSection from '../components/MapSection.jsx'; 
import PopularDestinations from '../components/PopularDestinations.jsx';
import LocalSuggestions from '../components/LocalSuggestions.jsx'; // <-- YENİ IMPORT

function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-display">
      <div className="layout-container flex h-full grow flex-col">
        
        <Header />
        
        <main className="flex-1">
          <HeroSection />

          {/* Rota Galerisi (Tam Genişlik) */}
          <DiscoveredRoutes />

          {/* Harita Bölümü (Tam Genişlik) */}
          <MapSection />

          {/* Popüler Destinasyonlar (Tam Genişlik - Kenar Boşluklu) */}
          <PopularDestinations />

          {/* --- YENİ EKLENEN: YEREL ÖNERİLER --- */}
          <LocalSuggestions />

          {/* Sayfanın en altında footer öncesi biraz boşluk */}
          <div className="pb-32"></div>
        </main>
        
      </div>
    </div>
  );
}

export default HomePage;