import React, { useRef } from 'react';

const LocalSuggestions = () => {
  const scrollRef = useRef(null);

  // 9 Adet Dolu Dolu Yerel Öneri (Pexels Linkleri - Kırılmaz)
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
      title: 'Tarihi El Sanatları',
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
      title: 'Antik Tiyatro',
      author: '@tarihci',
      image: 'https://images.pexels.com/photos/2245436/pexels-photo-2245436.png?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6,
      title: 'Gün Batımı Tepesi',
      author: '@dogasever',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 7,
      title: 'Taş Köprü',
      author: '@gezgin',
      image: 'https://images.pexels.com/photos/210464/pexels-photo-210464.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 8,
      title: 'Lavanta Bahçeleri',
      author: '@dogainsanı',
      image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 9,
      title: 'Yayla Kahvaltısı',
      author: '@lezzetavcisi',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  // Kaydırma Fonksiyonu - Ekran genişliği kadar (3 kart birden) kaydırır
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Görünür alanın genişliğini al (paddingler hariç)
      const containerWidth = current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-8 mt-24 px-4 md:px-12">
      
      <section className="relative group/slider">
        {/* Başlık ve Oklar */}
        <div className="flex items-center justify-between mb-6 px-1">
           <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark uppercase">YEREL ÖNERİLER</h2>
           
           {/* Oklar Başlık Hizasında */}
           <div className="flex gap-3">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-primary">chevron_left</span>
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
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
          {suggestions.map((item) => (
            <div 
              key={item.id} 
              // --- MATEMATİKSEL AYAR ---
              // gap-6 = 24px. 
              // 3 kart için 2 boşluk var: 2 * 24px = 48px.
              // Formül: (100% - 48px) / 3 = Tek kart genişliği.
              // Mobilde: Tam genişlik (w-full)
              // Tablette: 2 kart (calc(50% - 12px))
              // Masaüstünde: 3 kart (calc(33.333% - 16px))
              className="relative flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white dark:bg-card-dark rounded-2xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 snap-start"
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
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg text-primary">account_circle</span>
                    {item.author}
                  </p>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    Öneri
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default LocalSuggestions;