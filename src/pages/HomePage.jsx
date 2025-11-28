import React from 'react';
import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import DiscoveredRoutes from '../components/DiscoveredRoutes.jsx'; 
import MapSection from '../components/MapSection.jsx'; // MapSection'ı import ediyoruz

function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        
        <Header />
        
        <main className="flex-1">
          <HeroSection />

          {/* Rota Galerisi (Tam genişlikte, kendi padding'ini yönetiyor) */}
          <DiscoveredRoutes />

          {/* DÜZELTME: MapSection'ı da kısıtlayıcı div'in DIŞINA taşıdık */}
          {/* Artık kendi hizalamasını ve dikey boşluğunu kendi yönetecek */}
          <MapSection />

          {/* Gelecekteki diğer bölümler (Popüler, Hızlı Eylemler vb.) 
              bu kısıtlayıcı div'in İÇİNDE kalacak. 
              Dikey boşlukları (py-16) bu div'den alacaklar.
          */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 space-y-16 md:space-y-24">
            
            {/* MapSection buradaydı, yukarı taşıdık. */}
            
            {/* Kalan Bölümler (Popüler Destinasyonlar, Hızlı Eylemler vb.)
              buraya gelecek...
            */}

          </div>
        </main>
        
      </div>
    </div>
  );
}

export default HomePage;