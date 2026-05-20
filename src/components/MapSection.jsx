import React, { useState, useRef } from 'react';
import InteractiveTurkeyMap from './InteractiveTurkeyMap.jsx';

function MapSection() {
  
  // State: Üzerine gelinen ve Seçilen ilin adları
  const [hoveredCityName, setHoveredCityName] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState(null);
  
  // Tooltip pozisyonu ve görünürlüğü
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false });
  
  // --- HOVER (Üzerine Gelme) İşlemleri ---
  const handleCityHover = (cityName, event) => {
    setHoveredCityName(cityName);
    if (event) {
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
    if (selectedCityName === cityName) {
      setSelectedCityName(null);
    } else {
      setSelectedCityName(cityName);
    }
    console.log("Seçilen Şehir:", cityName);
  };

  return (
    <section 
      className="soft-slide-up stagger-2 py-16 md:py-24 w-full"
      onMouseMove={handleMouseMove} 
    >
      
      {/* DİKKAT: Başlığı buradan kaldırdım ve aşağıya, 
         haritanın olduğu kutunun içine taşıdım.
      */}

      <div className="px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-start">
        
        {/* SOL TARA (Harita Alanı) */}
        <div className="flex-grow w-full relative"> 
          
          {/* --- BAŞLIK BURAYA TAŞINDI --- */}
          {/* Artık sadece haritanın genişliğine göre ortalanacak */}
          <div className="w-full text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Türkiye'yi Haritada Keşfet</h2>
          </div>
          {/* ----------------------------- */}
          
          <InteractiveTurkeyMap 
            onCityHover={handleCityHover}
            onCityLeave={handleCityLeave}
            onCityClick={handleCityClick}
            hoveredCityName={hoveredCityName}   
            selectedCityName={selectedCityName} 
          />

          {/* TOOLTIP */}
          {tooltipPos.visible && hoveredCityName && (
            <div 
              className="il-isimleri" 
              style={{ 
                top: tooltipPos.y, 
                left: tooltipPos.x,
                position: 'fixed' 
              }}
            >
              <div>{hoveredCityName}</div>
            </div>
          )}
        </div>
        
        {/* SAĞ TARAF (Kenar Çubuğu) */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg mt-14"> 
        {/* mt-14 ekledim ki başlık hizasına denk gelmesin, menü biraz aşağı insin */}
          
          <h3 className="font-bold text-xl mb-4">Şehir Ara</h3>
          <input 
            className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary" 
            placeholder="örn. İzmir" 
            type="text"
          />
          
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