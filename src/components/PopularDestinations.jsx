import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PopularDestinations = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Takvim state'leri
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dummyRoute, setDummyRoute] = useState(null);

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

  // Takvim fonksiyonları
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setDummyRoute(null);
  };
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setDummyRoute(null);
  };

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const getFirstDayOfMonth = (y, m) => {
    let day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Atanmış rotalar (Kullanıcı talebi: 12 Mart, 15 Nisan gibi özel atamalar)
  const plannedRoutes = {
    [`${year}-2-12`]: { title: 'Tarihi Yarımada Turu', desc: 'Ayasofya, Sultanahmet, Topkapı Sarayı', image: 'https://media.cntravellerme.com/photos/6867aeba85cc078a3f1e5ad3/1:1/w_2160,h_2160,c_limit/1480863367' }, // 12 Mart (month: 2)
    [`${year}-3-15`]: { title: 'Boğaz Turu & Ortaköy', desc: 'Eminönü Boğaz Turu, Ortaköy Sahil, Bebek', image: 'https://cdn.britannica.com/34/10734-050-29C0B3FE/Clock-tower-Izmir-Turkey.jpg' } // 15 Nisan (month: 3)
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const key = `${year}-${month}-${day}`;
    if (plannedRoutes[key]) {
      setDummyRoute(plannedRoutes[key]);
      setSelectedDate('');
    } else {
      setDummyRoute(null);
      setSelectedDate(`${year}-${(month+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    }
  };

  return (
    <div className="w-full space-y-16 mt-16 px-4 md:px-12">
      
      {/* --- SLIDER --- */}
      <section className="soft-slide-up stagger-3 relative group/slider">
        
        {/* Başlık ve Oklar */}
        <div className="flex items-center justify-between mb-6 px-2">
             <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">POPÜLER DESTİNASYONLAR</h2>
             
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
              className="relative flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] h-[500px] rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl cursor-pointer group snap-start"
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src={dest.image} 
                alt={dest.title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
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
          <button 
            onClick={() => navigate('/yeni-rota')}
            className="group w-full flex flex-col items-center justify-center p-12 rounded-2xl bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all duration-300 border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">add_road</span>
            <span className="text-xl font-bold tracking-wide">YENİ ROTA OLUŞTUR</span>
          </button>

          <button 
            onClick={() => setShowCalendar(true)}
            className="group w-full flex flex-col items-center justify-center p-12 rounded-2xl bg-secondary/5 dark:bg-secondary/10 hover:bg-secondary/10 dark:hover:bg-secondary/20 text-secondary transition-all duration-300 border border-secondary/10 hover:border-secondary/30 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">calendar_month</span>
            <span className="text-xl font-bold tracking-wide">TAKVİM</span>
          </button>

          <button className="group w-full flex flex-col items-center justify-center p-12 rounded-2xl bg-accent/5 dark:bg-accent/10 hover:bg-accent/10 dark:hover:bg-accent/20 text-accent transition-all duration-300 border border-accent/10 hover:border-accent/30 shadow-sm hover:shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">casino</span>
            <span className="text-xl font-bold tracking-wide">GİZEMLİ YERLER</span>
          </button>
        </div>
      </section>

      {/* --- TAKVİM MODALI --- */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1b1e] w-full max-w-4xl rounded-3xl p-8 shadow-2xl scale-in-center flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                Gezi Takvimi
              </h3>
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex flex-col md:flex-row gap-8 overflow-y-auto pr-2 custom-scrollbar">
              {/* Sol: Takvim */}
              <div className="flex-1">
                {/* Ay Navigasyon */}
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                    {monthNames[month]} {year}
                  </h4>
                  <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>

                {/* Gün İsimleri */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {daysOfWeek.map(d => (
                    <div key={d} className="text-center font-bold text-gray-500 dark:text-gray-400 text-sm">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Günler */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="h-12"></div>;
                    const key = `${year}-${month}-${day}`;
                    const hasRoute = plannedRoutes[key];
                    const isSelected = selectedDate === `${year}-${(month+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` || (dummyRoute && dummyRoute.title === hasRoute?.title);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`relative h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all cursor-pointer
                          ${isSelected ? 'bg-secondary text-white shadow-md shadow-secondary/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                          ${hasRoute && !isSelected ? 'border-2 border-red-500/50' : ''}
                        `}
                      >
                        {day}
                        {hasRoute && !isSelected && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sağ: Seçili Gün Detayı veya Dümenden Rota */}
              <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                {dummyRoute ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Atanmış Rota</h4>
                    <img src={dummyRoute.image} alt={dummyRoute.title} className="w-full h-32 object-cover rounded-xl mb-4 shadow-sm" />
                    <h5 className="font-bold text-lg text-primary mb-1">{dummyRoute.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{dummyRoute.desc}</p>
                    <button 
                      onClick={() => {
                        setShowCalendar(false);
                        navigate('/yeni-rota');
                      }}
                      className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Rotayı Görüntüle
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                ) : selectedDate ? (
                  <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-16 h-16 mx-auto bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-3xl">event_available</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Tarih Seçildi</h4>
                    <p className="text-2xl font-black text-secondary mb-6">{selectedDate.split('-').reverse().join('.')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Bu tarih için yeni bir gezi planı oluşturabilirsiniz.</p>
                    <button 
                      onClick={() => {
                        setShowCalendar(false);
                        navigate('/yeni-rota');
                      }}
                      className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-secondary/30 cursor-pointer"
                    >
                      Plan Oluştur
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-5xl mb-4 opacity-50">touch_app</span>
                    <p>Detayları görmek veya yeni plan yapmak için takvimden bir gün seçin.</p>
                    <p className="mt-4 text-xs opacity-70">Kırmızı işaretli günler atanmış rotaları gösterir.</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default PopularDestinations;