import React from 'react';
// Harita verilerini ayrı dosyadan içe aktarıyoruz
import { citiesMapData } from '../data/citiesMapData.js'; 

function TurkeyMapSVG({ hoveredCityId, selectedCityId, onCityHover, onCityLeave, onCityClick }) {
  return (
    <svg 
      version="1.1" 
      id="svg-turkey-map" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 900 450" // GSB sitesindeki viewBox'ı kullanıyoruz
      xmlSpace="preserve"
      className="w-full h-auto max-h-[500px] rounded-xl shadow-lg bg-gray-200 dark:bg-gray-700" // Arkaplan ekledik (isteğe bağlı)
    >
      <g>
        {/* citiesMapData dizisindeki her il için bir <path> oluşturuyoruz */}
        {citiesMapData.map((city) => (
          <path
            key={city.id} // React için benzersiz anahtar (plaka kodu)
            id={city.id} // SVG içinde path'e ID atayabiliriz (opsiyonel)
            // 'd' attribute'u '../data/citiesMapData.js' dosyasından gelecek.
            // Eğer o dosyadaki 'd' değeri boş veya '...' ise, path çizilmez.
            d={city.d || "M0,0"} // Eğer 'd' verisi yoksa hiçbir şey çizme
            className={`city-path ${hoveredCityId === city.id ? 'hovered' : ''} ${selectedCityId === city.id ? 'selected' : ''}`}
            // Olay dinleyicileri: MapSection'daki fonksiyonları çağırır
            onMouseOver={() => onCityHover(city.id)}
            onMouseOut={onCityLeave}
            onClick={() => onCityClick(city.id)}
          >
            {/* Tarayıcının varsayılan tooltip'i için il adı */}
            <title>{city.name}</title> 
          </path>
        ))}
      </g>
    </svg>
  );
}

export default TurkeyMapSVG;