import React, { useState, useRef, useEffect } from 'react';
import InteractiveTurkeyMap from './InteractiveTurkeyMap.jsx';

function MapSection() {
  
  // State: Üzerine gelinen ve Seçilen ilin adları
  const [hoveredCityName, setHoveredCityName] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState(null); // Seçili şehri tutmak için
  
  // Tooltip pozisyonu ve görünürlüğü
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false });
  
  // Tooltip Ref
  const tooltipRef = useRef(null);

  // --- HOVER (Üzerine Gelme) İşlemleri ---
  const handleCityHover = (cityName, event) => {
    setHoveredCityName(cityName);
    if (event) {
      // Tooltip'i farenin biraz sağına ve altına koy
      setTooltipPos({ x: event.clientX + 20, y: event.clientY + 20, visible: true });
    }
  };

  const handleCityLeave = () => {
    setHoveredCityName(null);
    setTooltipPos(prev => ({ ...prev, visible: false }));
  };

  const handleMouseMove = (event) => {
    if (tooltipPos.visible) {
      setTooltipPos({ x: event.clientX + 20, y: event.clientY + 20, visible: true });
    }
  };

  // --- CLICK (Tıklama) İşlemleri ---
  const handleCityClick = (cityName) => {
    // Eğer zaten seçili şehre tıklandıysa seçimi kaldır, yoksa yeni şehri seç
    if (selectedCityName === cityName) {
      setSelectedCityName(null);
    } else {
      setSelectedCityName(cityName);
    }
    console.log("Seçilen Şehir:", cityName);
  };

  return (
    <section 
      className="soft-slide-up stagger-2 py-16 md:py-24"
      onMouseMove={handleMouseMove} // Fare hareketini takip et
    >
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Türkiye'yi Haritada Keşfet</h2>
      </div>

      <div className="px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-start">
        
        <div className="flex-grow w-full relative"> {/* Relative: Tooltip için önemli olabilir */}
          
          {/* DÜZELTME BURADA: State'leri (hovered ve selected) çocuğa gönderiyoruz! */}
          <InteractiveTurkeyMap 
            onCityHover={handleCityHover}
            onCityLeave={handleCityLeave}
            onCityClick={handleCityClick}
            hoveredCityName={hoveredCityName}   // <-- BU EKSİKTİ
            selectedCityName={selectedCityName} // <-- BU EKSİKTİ
          />

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Harita interaktif bir temsildir. Detaylar için şehirlere tıklayın.
          </p>

          {/* TOOLTIP (Sadece visible true ise ve bir isim varsa göster) */}
          {tooltipPos.visible && hoveredCityName && (
            <div 
              className="il-isimleri" 
              style={{ 
                top: tooltipPos.y, 
                left: tooltipPos.x,
                position: 'fixed' // Sayfa kaydırılsa bile fareyi takip etsin
              }}
            >
              <div>{hoveredCityName}</div>
            </div>
          )}
        </div>
        
        {/* Sağ Taraf (Kenar Çubuğu) */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-4">Şehir Ara</h3>
          <input 
            className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary" 
            placeholder="örn. İzmir" 
            type="text"
          />
          
          {/* Seçili Şehri Gösteren Alan (Test Amaçlı) */}
          {selectedCityName && (
             <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-primary font-bold">Seçili Rota: {selectedCityName}</p>
             </div>
          )}

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Öne Çıkanlar:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">location_on</span> İstanbul
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">location_on</span> Ankara
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">location_on</span> İzmir
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

export default MapSection;