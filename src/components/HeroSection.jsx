import React from 'react';

function HeroSection() {
  // Bu resim URL'sini ileride Supabase'den veya API'den alacağız
  // Bu geçici URL, Kapadokya resmini göstermeyebilir.
  const heroImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpnLt_NVz49naxTdoqwnN9_CTgMJDLlUYzN9zhwQ35hUbs_ZrbNZfSaP6cJglqUU09kZJ9Xlgmuk2qjAW6vKpKbpc2k4-Kw6Kq54UEI02Zikt_7swfT1qHlKBStIBiBvrE8M5eGSAP8ilNtO9ekPxvBxu0Ixz2udg3m-LU3LoJq-ntsBhhshiL3jSz4CyQLwgp2ojwGERbo3S4Cat1T-Dt6ly7DazbXwmxnNjFTKw527aUa_73qcVbK9HX8Srg4YQ9_SLHDNxkZkl"; 

  return (
    <section className="relative min-h-[60vh] md:min-h-[75vh] flex items-center justify-center text-center soft-slide-up">
      {/* Arkaplan Resmi ve Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        data-alt="Breathtaking view of hot air balloons over Cappadocia at sunrise." 
        // Not: Yukarıdaki URL çalışmazsa, stil görünür ama resim görünmez.
        // Geçici olarak çalışan bir resimle değiştirebiliriz, 
        // örn: "https://images.unsplash.com/photo-1576627688758-6202ea6de3d1"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("${heroImageUrl}")`
        }}
      ></div>
      
      {/* İçerik */}
      <div className="relative z-10 px-6">
        <h1 
          className="text-white text-5xl md:text-7xl font-extrabold tracking-tight" 
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
        >
          Türkiye'yi Kendi Yolunla Keşfet
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-white/90 text-lg md:text-xl">
          Unutulmaz anılar biriktirmek için macerana bugün başla.
        </p>
        <button className="mt-8 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-lg font-bold shadow-lg hover:bg-sky-500">
          Planlamaya Başla
        </button>
      </div>
    </section>
  );
}

export default HeroSection;