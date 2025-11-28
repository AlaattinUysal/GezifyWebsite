import React, { useRef } from 'react';

const DiscoveredRoutes = () => {
  const scrollRef = useRef(null);

  // TAM İSABET RESİMLERLE GÜNCELLENMİŞ ROTA VERİLERİ
  const routes = [
    {
      id: 1,
      title: 'İstanbul 3 Günlük',
      rating: '4.9',
      count: '12K',
      // Galata Kulesi ve Boğaz
      image: 'https://cdnp.flypgs.com/files/ulkeler/Turkiye/TR/tarihi-istanbul-turu.jpg'
    },
    {
      id: 2,
      title: 'Ege Kıyıları',
      rating: '4.8',
      count: '8K',
      // Bodrum / Ege denizi ve beyaz evler
      image: "https://image.elitema.com.tr/db_images/45/4/981/oludeniz.jpg"
    },
    {
      id: 3,
      title: 'Kapadokya Macera',
      rating: '4.9',
      count: '15K',
      // Balonlar ve Peribacaları
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Likya Yolu',
      rating: '4.9',
      count: '7K',
      // Likya yolu manzarası
      image: "https://perdue.com.tr/wp-content/uploads/2021/05/likya-yolu-4.jpg"
    },
    {
      id: 5,
      title: 'Karadeniz Yaylaları',
      rating: '4.7',
      count: '5K',
      // Yeşil Yayla, Sis ve Dağ Evi (Ayder/Rize)
      image: 'https://karadenizturlari.com.tr/uploads/2025/06/karadeniz-yayla-turlari.jpg'
    },
    // --- 2. Grup (Sağ oka basınca gelecekler) ---
    {
      id: 6,
      title: 'Mardin Kültür Turu',
      rating: '4.8',
      count: '6K',
      // Mardin Taş Evleri ve Mezopotamya Ovası
      image: 'https://www.mardingezirehberim.com/wp-content/webp-express/webp-images/uploads/2025/09/Mardin-Turu-6-600x700.jpeg.webp'
    },
    {
      id: 7,
      title: 'Van Gölü Ekspresi',
      rating: '4.6',
      count: '4K',
      // Van Gölü ve Akdamar Kilisesi
      image: 'https://www.bizcetatil.com/images/tour/972_b.jpg'
    },
    {
      id: 8,
      title: 'Antalya Şelaleler',
      rating: '4.9',
      count: '11K',
      // Düden/Kurşunlu Şelalesi benzeri
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 9,
      title: 'İzmir Köyleri',
      rating: '4.7',
      count: '9K',
      // Alaçatı/Şirince tarzı taş sokaklar
      image: 'https://www.gruppal.com/blog/public/assets/img/90eb1e0cb554586d1e46441f2d30e82a.jpg'
    },
    {
      id: 10,
      title: 'Gaziantep Lezzet',
      rating: '5.0',
      count: '18K',
      // Baklava ve Fıstık
      image: 'https://gezikesifleri.com/wp-content/uploads/2025/09/gaziantep-lezzet-turu-nasil-yapilir-adim-adim-gurme-rehberi-1-780x470.jpg'
    }
  ];

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.clientWidth;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-8 mt-16 px-4 md:px-12">
      
      <section className="relative group/slider">
        
        <div className="flex items-center justify-between mb-6 px-1">
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-3xl animate-pulse">auto_awesome</span>
              <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark uppercase">KEŞFEDİLEN ROTALAR</h2>
           </div>
           
           <div className="flex gap-2 md:hidden">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
           </div>
        </div>

        {/* MASAÜSTÜ SOL OK */}
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-5 w-12 h-12 bg-white dark:bg-card-dark text-primary rounded-full shadow-xl items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-gray-700 cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {routes.map((route) => (
            <div 
              key={route.id} 
              // --- 5'Lİ KART YAPISI ---
              className="relative flex-shrink-0 w-[85vw] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)] bg-card-light dark:bg-card-dark rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 snap-start group cursor-pointer"
            >
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-4/5 mx-auto shadow-md transition-transform duration-500 group-hover:scale-105 border-4 border-white dark:border-gray-700"
                style={{ backgroundImage: `url("${route.image}")` }}
              ></div>

              <div className="text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text-light dark:text-text-dark truncate">{route.title}</h3>
                  <p className="text-sm text-accent font-bold flex items-center justify-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">star</span> 
                    {route.rating} 
                    <span className="text-gray-400 font-normal text-xs">({route.count})</span>
                  </p>
                </div>
                
                <button className="w-full mt-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all duration-300">
                  ROTA DETAY
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MASAÜSTÜ SAĞ OK */}
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-5 w-12 h-12 bg-white dark:bg-card-dark text-primary rounded-full shadow-xl items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-gray-700 cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>

      </section>
    </div>
  );
};

export default DiscoveredRoutes;