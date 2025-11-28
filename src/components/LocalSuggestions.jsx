import React, { useRef } from 'react';

const LocalSuggestions = () => {
  const scrollRef = useRef(null);

  const suggestions = [
    {
      id: 1,
      title: 'Gizli Koy',
      author: '@seyahatci',
      image: 'https://images.pexels.com/photos/3569950/pexels-photo-3569950.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      title: 'Dağ Köyü Kahvesi',
      author: '@fotografci',
      image: 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'Tarihi El Sanatları Çarşısı',
      author: '@gurme',
      image: 'https://images.pexels.com/photos/1830252/pexels-photo-1830252.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'Yöresel Lezzet Durağı',
      author: '@damaktadi',
      image: 'https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 5,
      title: 'Antik Tiyatro Kalıntıları',
      author: '@tarihci',
      image: 'https://images.pexels.com/photos/2245436/pexels-photo-2245436.png?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6,
      title: 'Gün Batımı Tepesi',
      author: '@dogasever',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    // --- YENİ EKLENENLER ---
    {
      id: 7,
      title: 'Tarihi Taş Köprü',
      author: '@gezgin',
      image: 'https://images.pexels.com/photos/210464/pexels-photo-210464.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 8,
      title: 'Lavanta Bahçeleri',
      author: '@doğainsanı',
      image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 9,
      title: 'Yayla Kahvaltısı',
      author: '@lezzetavcisi',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  // Kaydırma Fonksiyonu
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Her tıklamada yaklaşık bir kart boyu kadar kaydırır
      const scrollAmount = direction === 'left' ? -370 : 370;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-8 mt-24 px-4 md:px-12 relative group/slider">
      
      {/* Başlık ve Mobil Oklar */}
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark uppercase">YEREL ÖNERİLER</h2>
          
          {/* Mobil için oklar (Başlığın yanında görünür) */}
          <div className="flex gap-2 md:hidden">
            <button 
              onClick={() => scroll('left')} 
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
      </div>

      {/* MASAÜSTÜ SOL OK (Kartların üzerinde, solda) */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-card-dark text-primary rounded-full shadow-xl items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-gray-700 cursor-pointer"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Kaydırılabilir Alan */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {suggestions.map((item) => (
          <div 
            key={item.id} 
            // Kart Genişliği: Mobilde %85, Masaüstünde 350px (Daha dolgun görünüm)
            className="relative flex-shrink-0 w-[85vw] sm:w-[350px] bg-white dark:bg-card-dark rounded-2xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Resim Alanı */}
            <div className="overflow-hidden h-64 relative">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src={item.image} 
                alt={item.title}
                loading="lazy"
              />
              {/* Hafif karartma overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            
            {/* Metin Alanı */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  {item.author}
                </p>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  Öneri
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MASAÜSTÜ SAĞ OK (Kartların üzerinde, sağda) */}
      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-card-dark text-primary rounded-full shadow-xl items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-gray-700 cursor-pointer"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

    </div>
  );
};

export default LocalSuggestions;