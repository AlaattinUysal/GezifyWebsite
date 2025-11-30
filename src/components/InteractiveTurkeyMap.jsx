// src/components/InteractiveMap.jsx

import React, { useState } from 'react';
import './InteractiveMap.css';
import { citiesMapData } from '../data/citiesMapData';

const InteractiveMap = ({ onCitySelect }) => {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  
  // Tooltip pozisyonu (Sabit konumlandırma için)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleCityClick = (city) => {
    // YENİ MANTIK: Toggle (Aç/Kapa)
    if (selectedCityId === city.id) {
      // 1. Eğer tıklanan şehir ZATEN seçiliyse -> Seçimi Kaldır
      setSelectedCityId(null);
      if (onCitySelect) {
        onCitySelect(null); // Üst bileşene "hiçbir şey seçili değil" de
      }
    } else {
      // 2. Eğer farklı bir şehir ise veya hiç seçim yoksa -> Yeni Şehri Seç
      setSelectedCityId(city.id);
      if (onCitySelect) {
        onCitySelect(city.name);
      }
    }
  };

  // Şehrin üzerine gelince merkezini bulup tooltip'i oraya sabitleme
  const handleMouseEnter = (e, cityName) => {
    setHoveredCity(cityName);

    const pathElement = e.target;
    const rect = pathElement.getBoundingClientRect();

    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);

    setTooltipPos({ x: centerX, y: centerY });
  };

  const selectedCityObj = citiesMapData.find(city => city.id === selectedCityId);

  return (
    <div className="map-container">
      
      {/* TOOLTIP (Şehrin tam ortasında sabit) */}
      {hoveredCity && (
        <div 
          className="map-tooltip" 
          style={{ 
            left: tooltipPos.x + 'px', 
            top: tooltipPos.y + 'px' 
          }}
        >
          {hoveredCity}
        </div>
      )}

      <svg
        version="1.1"
        id="turkey-map-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1007.478 477.787"
        className="turkey-svg"
      >
        <g id="turkey-provinces">
          {citiesMapData.map((city) => {
            let cityClass = "city-path";
            
            // Seçili olanı kontrol et
            if (selectedCityId === city.id) {
              cityClass += " is-selected";
            } 
            // Hover olanı kontrol et (Seçili değilse mavi olsun)
            else if (hoveredCity === city.name) {
              cityClass += " is-hovered";
            }

            return (
              <path
                key={city.id}
                id={city.id}
                d={city.d}
                className={cityClass}
                // Fare olayları
                onMouseEnter={(e) => handleMouseEnter(e, city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => handleCityClick(city)}
              />
            );
          })}
        </g>
      </svg>

      {/* Harita Altı Şehir İsmi */}
      <div className="selected-city-display">
        {selectedCityObj ? (
          <h2 className="city-title">{selectedCityObj.name}</h2>
        ) : (
          <p className="city-placeholder">Detayları görmek için haritadan bir şehir seçin.</p>
        )}
      </div>

    </div>
  );
};

export default InteractiveMap;