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
    // 2. Sayfa (Tam 4 kartlık yeni set)
    {
      id: 5,
      title: 'Mardin',
      image: "https://artuklu.bel.tr/tema/genel/uploads/sayfalar/buyuk-mardin-otelinden.jpg"
    },
    {
      id: 6,
      title: 'İzmir',
      image: "https://cdn.britannica.com/34/10734-050-29C0B3FE/Clock-tower-Izmir-Turkey.jpg"
    },
    {
      id: 7,
      title: 'Rize',
      image: "https://vagonatinyhouse.com/wp-content/uploads/2021/07/rize_rize-firtina-vadisi-8d5447-1170x650.jpg"
    },
    {
      id: 8,
      title: 'Fethiye',
      image: "https://dunyakentimugla.org/wp-content/uploads/2019/11/FETHIYE.webp"
    }
  ];

  // Kaydırma Fonksiyonu - Tam bir görünüm genişliği kadar kaydırır
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Konteynerin genişliğini al (paddingler hariç)
      const containerWidth = current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-16 mt-16 px-4 md:px-12"> {/* Kenar Boşlukları Burada */}
      
      {/* --- SLIDER --- */}
      <section className="soft-slide-up stagger-3 relative group/slider">
        
        {/* Başlık ve Oklar */}
        <div className="flex items-center justify-between mb-6 px-2">
             <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">POPÜLER DESTİNASYONLAR</h2>
             
             {/* Oklar Başlığın Yanında */}
             <div className="flex gap-3">
                <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary">chevron_left</span>
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary">chevron_right</span>
                </button>
             </div>
        </div>
        
        {/* Kaydırılabilir Alan */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {destinations.map((dest, index) => (
            <div 
              key={`${dest.id}-${index}`} 
              // Matematiksel Hesap:
              // w-full: Mobilde 1 tane
              // sm:w-[calc(50%-12px)]: Tablette 2 tane (gap-6=24px, yarısı 12px)
              // lg:w-[calc(25%-18px)]: Masaüstünde 4 tane (gap-6=24px, 3 boşluk toplam 72px, 4'e böl 18px)
              className="relative flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] h-[500px] rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl cursor-pointer group snap-start"
            >
              {/* Resim */}
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src={dest.image} 
                alt={dest.title}
                loading="lazy"
              />
              {/* Karartma */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
              {/* Yazılar */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-white text-4xl font-bold drop-shadow-lg mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{dest.title}</h3>
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300 opacity-0 group-hover:opacity-100">
                   <p className="text-white/90 text-sm uppercase tracking-widest font-medium flex items-center gap-2 mt-2">
                     KEŞFET <span className="material-symbols-outlined text-sm">arrow_forward</span>
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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