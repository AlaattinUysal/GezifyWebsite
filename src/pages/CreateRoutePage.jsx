// src/pages/CreateRoutePage.jsx

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import RouteMap from '../components/RouteMap';

const CreateRoutePage = () => {
  const scrollRef = useRef(null);

  // --- STATE ---
  const [selectedStops, setSelectedStops] = useState([]); // Seçilen yerler
  const [showRoute, setShowRoute] = useState(false);      // Rota çizilsin mi?

  // --- POPÜLER YERLER VERİSİ (Koordinatlı) ---
  const popularPlaces = [
    { id: 1, title: "Galata Kulesi", image: "https://galatakulesi.org/wp-content/uploads/2023/06/galata-kulesi-1-750x375.jpg", lat: 41.0256, lng: 28.9741 },
    { id: 2, title: "Ayasofya", image: "https://muze.gov.tr/s3/MysFileLibrary/Ayasofya/ayasofya-02.jpg", lat: 41.0086, lng: 28.9802 },
    { id: 3, title: "Sultanahmet Camii", image: "https://www.ktb.gov.tr/Resim/16632,sultanahmet-cami-istanbul.png?0", lat: 41.0054, lng: 28.9768 },
    { id: 4, title: "Topkapı Sarayı", image: "https://muze.gov.tr/s3/MysFileLibrary/TopkapiSarayi/topkapisarayi-02.jpg", lat: 41.0115, lng: 28.9833 },
    { id: 5, title: "Kapalıçarşı", image: "https://www.kapalicarsi.com.tr/wp-content/uploads/2020/09/kapalicarsi-tarihi.jpg", lat: 41.0107, lng: 28.9680 },
    { id: 6, title: "Kız Kulesi", image: "https://kizkulesi.gov.tr/s3/MysFileLibrary/KizKulesi/kizkulesi-06.jpg", lat: 41.0211, lng: 29.0041 },
    { id: 7, title: "Dolmabahçe Sarayı", image: "https://www.millisaraylar.gov.tr/images/saray-kosk-kasir/dolmabahce-sarayi/dolmabahce-sarayi-1.jpg", lat: 41.0391, lng: 29.0007 },
    { id: 8, title: "Yerebatan Sarnıcı", image: "https://yerebatan.com/wp-content/uploads/2023/02/yerebatan-sarnici-genel-bakis.jpg", lat: 41.0084, lng: 28.9779 },
  ];

  // --- FONKSİYONLAR ---
  
  // Galeri Kaydırma (Slider)
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Yer Ekle/Çıkar (Toggle)
  const togglePlace = (place) => {
    const isSelected = selectedStops.find(stop => stop.id === place.id);
    
    if (isSelected) {
      setSelectedStops(selectedStops.filter(stop => stop.id !== place.id));
    } else {
      setSelectedStops([...selectedStops, place]);
    }
    // Durak değiştiğinde rotayı sıfırla ki tekrar 'Hesapla' desin
    setShowRoute(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex overflow-hidden">
      
      {/* --- SOL SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-card-dark border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
             <span className="material-symbols-outlined text-2xl">explore</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Gezify</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">explore</span><span className="text-sm font-medium">Keşfet</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
            <span className="material-symbols-outlined">route</span><span className="text-sm">Rotalarım</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">favorite</span><span className="text-sm font-medium">Favoriler</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full h-12 bg-primary hover:bg-sky-600 text-white rounded-lg font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span> Yeni Rota
          </button>
        </div>
      </aside>

      {/* --- ANA İÇERİK --- */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark p-6 lg:p-8">
        <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* SOL KOLON: HARİTA VE GALERİ (8 Birim) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                
                {/* Başlık ve Aksiyon */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-text-light dark:text-text-dark text-3xl font-black tracking-tight">Yeni Rota Oluştur</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Aşağıdan yer seçin, haritada belirsin. Hazır olunca rotayı hesaplayın.</p>
                    </div>
                    {/* Rota Hesapla Butonu */}
                    <button 
                      onClick={() => setShowRoute(true)}
                      disabled={selectedStops.length < 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 ${selectedStops.length < 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-secondary hover:bg-rose-500'}`}
                    >
                      <span className="material-symbols-outlined">alt_route</span>
                      En Yakın Rotayı Hesapla
                    </button>
                </div>

                {/* --- HARİTA ALANI --- */}
                <div className="relative w-full h-[500px] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden z-0 bg-white">
                    {/* Akıllı Harita Bileşeni */}
                    <RouteMap selectedStops={selectedStops} showRoute={showRoute} />
                </div>

                {/* --- RESİM GALERİSİ (SLIDER) --- */}
                <div className="relative group">
                    {/* Sol Ok */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 bg-white/90 dark:bg-black/70 rounded-full shadow-lg flex items-center justify-center -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-primary cursor-pointer border border-gray-100 dark:border-gray-600"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {/* Galeri Kartları */}
                    <div 
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {popularPlaces.map((place) => {
                            const isSelected = selectedStops.find(stop => stop.id === place.id);
                            return (
                                <div 
                                  key={place.id} 
                                  onClick={() => togglePlace(place)}
                                  className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group/image relative snap-start shadow-sm transition-all duration-300 transform hover:-translate-y-1 border-2 ${isSelected ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent'}`}
                                >
                                    <img src={place.image} alt={place.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110" />
                                    
                                    {/* Seçili İkonu (Tik İşareti) */}
                                    {isSelected && (
                                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-md z-20 animate-bounce">
                                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                                      </div>
                                    )}

                                    {/* Hover Efekti: + Ekle İkonu */}
                                    {!isSelected && (
                                      <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
                                          <span className="material-symbols-outlined text-white text-lg">add</span>
                                      </div>
                                    )}

                                    {/* İsim Alanı */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                                        <p className="text-white font-bold text-sm shadow-black drop-shadow-md">{place.title}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sağ Ok */}
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 bg-white/90 dark:bg-black/70 rounded-full shadow-lg flex items-center justify-center translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-primary cursor-pointer border border-gray-100 dark:border-gray-600"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* SAĞ KOLON: FORM / LİSTE (4 Birim) */}
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 h-fit">
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                  Rota Listesi
                </h3>
                
                {selectedStops.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center border-2 border-dashed border-gray-100 rounded-xl">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">map</span>
                    <p className="text-sm">Henüz bir durak eklemediniz.</p>
                    <p className="text-xs mt-1 text-gray-300">Soldaki galeriden yer seçin.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <ul className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1">
                      {selectedStops.map((stop, index) => (
                        <li key={stop.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 group hover:border-primary/30 transition-colors">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold shadow-sm">{index + 1}</span>
                          <span className="text-sm font-medium text-text-light dark:text-text-dark flex-1">{stop.title}</span>
                          <button onClick={() => togglePlace(stop)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Rota Özeti */}
                    <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500">
                       <span>Toplam Durak: <b>{selectedStops.length}</b></span>
                       <span>Tahmini Süre: <b>{(selectedStops.length * 45)} dk</b></span>
                    </div>
                  </div>
                )}
            </div>

        </div>
      </main>
    </div>
  );
};

export default CreateRoutePage;