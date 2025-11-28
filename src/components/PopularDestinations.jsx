import React, { useRef } from 'react';

const PopularDestinations = () => {
  const scrollRef = useRef(null);

  const destinations = [
    {
      id: 1,
      title: 'Pamukkale',
      image: "https://www.pamukkale.com.tr/images/sehirler/denizli.jpg"
    },
    {
      id: 2,
      title: 'İstanbul',
      image: 'https://media.cntravellerme.com/photos/6867aeba85cc078a3f1e5ad3/1:1/w_2160,h_2160,c_limit/1480863367'
    },
    {
      id: 3,
      title: 'Antalya',
      image: 'https://ptimages.s3.eu-west-2.amazonaws.com/img/media_photos/why_is_antalya_so_popular-jpg.webp'
    },
    {
      id: 4,
      title: 'Kapadokya',
      image: "https://wp.oggusto.com/wp-content/uploads/2025/04/kapadokya-gun-dogumu-sicak-hava-balonlari-peribacalari.webp"
    },
    // Kaydırma efektini test etmek için verileri çoğaltıyoruz
    {
      id: 5,
      title: 'Pamukkale (2)',
      image: "https://www.pamukkale.com.tr/images/sehirler/denizli.jpg"
    },
    {
      id: 6,
      title: 'İstanbul (2)',
      image: 'https://media.cntravellerme.com/photos/6867aeba85cc078a3f1e5ad3/1:1/w_2160,h_2160,c_limit/1480863367'
    }
  ];

  // Kaydırma Fonksiyonu
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-16 mt-16 px-4 md:px-12"> {/* <-- KENAR BOŞLUKLARI BURADA (px-4 md:px-12) */}
      
      {/* --- SLIDER BÖLÜMÜ --- */}
      <section className="soft-slide-up stagger-3 relative group/slider">
        <div className="flex items-center justify-between mb-6">
             <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">POPÜLER DESTİNASYONLAR</h2>
             
             {/* Mobil için Oklar (Başlık Yanında) */}
             <div className="flex gap-2 md:hidden">
                <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"><span className="material-symbols-outlined">chevron_left</span></button>
                <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"><span className="material-symbols-outlined">chevron_right</span></button>
             </div>
        </div>

        {/* MASAÜSTÜ İÇİN SOL OK (Resimlerin Üzerinde) */}
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-[60%] -translate-y-1/2 z-20 -ml-6 w-12 h-12 bg-white dark:bg-card-dark text-primary rounded-full shadow-xl items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100 cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        {/* Kaydırılabilir Alan */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {destinations.map((dest, index) => (
            <div 
              key={`${dest.id}-${index}`} 
              // Kart Boyutları: Mobilde %85, Masaüstünde yaklaşık 400px
              className="relative flex-shrink-0 w-[85vw] sm:w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src={dest.image} 
                alt={dest.title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-white text-4xl font-bold drop-shadow-lg mb-2">{dest.title}</h3>
                <p className="text-white/90 text-sm uppercase tracking-widest font-medium flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  KEŞFET <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MASAÜSTÜ İÇİN SAĞ OK (Resimlerin Üzerinde) */}
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-[60%] -translate-y-1/2 z-20 -mr-6 w-12 h-12 bg-white dark:bg-card-dark text-primary rounded-full shadow-xl items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100 cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </section>

      {/* --- HIZLI EYLEMLER (BUTONLAR) --- */}
      <section className="soft-slide-up stagger-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="group w-full flex flex-col items-center justify-center p-12 rounded-2xl bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all duration-300 border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">add_road</span>
            <span className="text-xl font-bold tracking-wide">YENİ ROTA OLUŞTUR</span>
          </button>

          <button className="group w-full flex flex-col items-center justify-center p-12 rounded-2xl bg-secondary/5 dark:bg-secondary/10 hover:bg-secondary/10 dark:hover:bg-secondary/20 text-secondary transition-all duration-300 border border-secondary/10 hover:border-secondary/30 shadow-sm hover:shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">calendar_month</span>
            <span className="text-xl font-bold tracking-wide">TAKVİM</span>
          </button>

          <button className="group w-full flex flex-col items-center justify-center p-12 rounded-2xl bg-accent/5 dark:bg-accent/10 hover:bg-accent/10 dark:hover:bg-accent/20 text-accent transition-all duration-300 border border-accent/10 hover:border-accent/30 shadow-sm hover:shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">casino</span>
            <span className="text-xl font-bold tracking-wide">GİZEMLİ YERLER</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default PopularDestinations;