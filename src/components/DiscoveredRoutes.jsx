import React, { useRef, useState } from 'react';

function DiscoveredRoutes() {
  const galleryRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  
  // Kaydırma miktarı (360px kart + 24px boşluk)
  const scrollAmount = 384; 

  const scrollRight = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (!showLeftArrow) {
        setShowLeftArrow(true);
      }
    }
  };

  const scrollLeft = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    // 1. Ana Kapsayıcı
    <section className="soft-slide-up stagger-1 py-16 md:py-24 space-y-4">
      
      {/* 2. Başlık Konteyneri */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">✨ KEŞFEDİLEN ROTALAR</h2>
      </div>

      {/* 3. Galeri ve Yön Tuşları Konteyneri */}
      <div className="relative w-full">
        
        {/* Sol Ok */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute z-10 top-1/2 -translate-y-1/2 left-6 lg:left-8 w-12 h-12 rounded-full bg-card-light dark:bg-card-dark shadow-lg flex items-center justify-center transition-opacity duration-300 opacity-80 hover:opacity-100 pointer-events-auto"
            aria-label="Sola Kaydır"
          >
            <span className="material-symbols-outlined text-text-light dark:text-text-dark">chevron_left</span>
          </button>
        )}

        {/* Sağ Ok */}
        <button
          onClick={scrollRight}
          className="absolute z-10 top-1/2 -translate-y-1/2 right-6 lg:right-8 w-12 h-12 rounded-full bg-card-light dark:bg-card-dark shadow-lg flex items-center justify-center transition-opacity duration-300 opacity-80 hover:opacity-100 pointer-events-auto"
          aria-label="Sağa Kaydır"
        >
          <span className="material-symbols-outlined text-text-light dark:text-text-dark">chevron_right</span>
        </button>
        
        {/* 4. Galeri */}
        <div 
          ref={galleryRef} 
          className="rolling-gallery overflow-x-hidden pl-6 lg:pl-8 pr-6 lg:pr-8"
          style={{ scrollBehavior: 'smooth' }} 
        >
          
          {/* Rota Kartı 1 */}
          <div className="rolling-gallery-item flex h-full flex-1 flex-col gap-4 text-center rounded-xl bg-card-light dark:bg-card-dark shadow-lg p-4">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-4/5" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDeG0bWp1Z62PtBxJ3LoSIPRWe9ckvYQpBpoHRNmJTD8nqG-1IDV39W6YjUGthQIxj0C3QEEj5p4ebvTnx3D8kQzD1nV2bbM5esxmLTS9SxgYW9c6O6R97NbDAnEz5o25kRoC13zX5lEbqRfLzo7ydxioogziaEbPsZffdj_Kl5xO3mbUSxzKRXklRSss2_4HtlaG5O1AulRtw42_5lJ3Vo9dIobFnUQZjJ3Vn93cwBHB9jqDF7_vxFmLa78KjuomckovELg8ExiYS")' }}
            ></div>
            <div className="flex flex-col flex-1 justify-between pt-0 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">İstanbul 3 Günlük</p>
                <p className="text-sm text-accent font-bold">⭐ 4.9 <span className="text-gray-400 font-normal">(12K)</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors">ROTA DETAY</button>
              </div>
            </div>
          </div>

          {/* Rota Kartı 2 */}
          <div className="rolling-gallery-item flex h-full flex-1 flex-col gap-4 text-center rounded-xl bg-card-light dark:bg-card-dark shadow-lg p-4">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-4/5" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuCDtHOo--fLcPJ9XhpznKFz-HBrK9zVQ9GklLH5AG2D7YeEU6vm3-OwFYKEfKJIulrEPvwAQMvH9b0B_Jb4m_pUcLIRRElqZTWBYnVUPTXLaeGQFM6dgh1XehLgUeI37x4mzHor_QgcREY1DN9QLvPqMuFLp6MNCga-_va-QlSybTwYuFcrmM4x2jG9ouKMpKvrJ8exf-gvjpP9lfDWrr7ai1u3rXvjDixjR2TcYk8e6aNd8ozi2da35gsh-OrT3TKG1l7zGgAONO")' }}
            ></div>
            <div className="flex flex-col flex-1 justify-between pt-0 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">Ege Kıyıları</p>
                <p className="text-sm text-accent font-bold">⭐ 4.8 <span className="text-gray-400 font-normal">(8K)</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors">ROTA DETAY</button>
              </div>
            </div>
          </div>

          {/* Rota Kartı 3 */}
          <div className="rolling-gallery-item flex h-full flex-1 flex-col gap-4 text-center rounded-xl bg-card-light dark:bg-card-dark shadow-lg p-4">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-4/5" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArGBJauTWJ1PxvKFgAl2iI-_tJy6vTn7Xzs2n3iNqcbrTlI7NPV8MoPtGWo1-GlBN-qMD9Vd0rIWo3kggqR9Z6Own4p19cJ8Db8ySn4yBGikg5KtwN3MDRpmsTGao2vxdqB5j7tPEtdGYqL59AQ7j3twTBjuAjAs8A9TVyvWn-MS5f2TG85m7waytLYiOFjvpeB6lhqrU4u9SkxpZn9QfdFx0AkCRaWDmqfh1JgUuJLxH46YRFPLw1Wg8MH5FowIolPHEcTEXi9RAR")' }}
            ></div>
            <div className="flex flex-col flex-1 justify-between pt-0 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">Kapadokya Macera</p>
                <p className="text-sm text-accent font-bold">⭐ 4.9 <span className="text-gray-400 font-normal">(15K)</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors">ROTA DETAY</button>
              </div>
            </div>
          </div>

          {/* Rota Kartı 4 */}
          <div className="rolling-gallery-item flex h-full flex-1 flex-col gap-4 text-center rounded-xl bg-card-light dark:bg-card-dark shadow-lg p-4">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-4/5" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCH-53XcZqxZHg6xZQfEg-qWjXeDohSmBdQgUMxlHYCwn7PugUYCUj9vkkSUZY3ZzG_7vWunIuEOhLQb6ySHlW3hE9PGvdFBgA7a2Zh8Jhr90ZGFNkCyfsK9Oma1KDfQDgPD-PSRD-f-IF-3kzndn66i8l04ljmUc7mbLCoFvzSFsUdrkJCHmxqnAT1aoth3j9biWqKyVCimFpb2cxb7XcP1Q877d18Ob9oMMqBGS5HbFSv6IyuV7OVjPFZlRWPz-j13Y26Xh0QYuu6")' }}
            ></div>
            <div className="flex flex-col flex-1 justify-between pt-0 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">Likya Yolu</p>
                <p className="text-sm text-accent font-bold">⭐ 4.9 <span className="text-gray-400 font-normal">(7K)</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors">ROTA DETAY</button>
              </div>
            </div>
          </div>

          {/* Rota Kartı 5 */}
          <div className="rolling-gallery-item flex h-full flex-1 flex-col gap-4 text-center rounded-xl bg-card-light dark:bg-card-dark shadow-lg p-4">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-4/5" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfTv9aYEJpgKhTIE_Ay-gyCCtvVCQaHeVvmIkfp839X4vQWKt6TiRbQAt-Vclu60aeBqAub-yhz9DK2uySoJ6lzR01CFMCKhf7d5sP9SicfmUsjA37nlkacLh59uqfl9L9Aq8bDEaDcb-hV6XPFEok8E_ONND3jPUccWmCRC033hBrTJLlKZas727ybjS3XJqA9lMll5_m8C1KYQhhjfnF4Qzj8fK2Mgh8PZgjDp6Z316s37BVrDAQ-muDexbGUBhnRpxaDIwTySd0")' }}
            ></div>
            <div className="flex flex-col flex-1 justify-between pt-0 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">Karadeniz Yaylaları</p>
                <p className="text-sm text-accent font-bold">⭐ 4.7 <span className="text-gray-400 font-normal">(5K)</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors">ROTA DETAY</button>
              </div>
            </div>
          </div>
          
          {/* YENİ EKLENEN KART (6. KART) */}
          <div className="rolling-gallery-item flex h-full flex-1 flex-col gap-4 text-center rounded-xl bg-card-light dark:bg-card-dark shadow-lg p-4">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex flex-col self-center w-4/5" 
              // Test için farklı bir resim (Pamukkale) kullandım
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByR2yxh-P_pCSwVihDlCUW5yxvph8rhkGOsXHYriNoOGU4RIqn9V15Vu0CbZjdXIo0DbDsxWbweQDqpcENqFyRv5zPqa2WvD5NGHkWtpoP_ns6rtNRQ18lD_K4WkBVbTdmJZ-RuHzKXF5unEOGkH29zwwmfcJO5R0CgqxXLocDLTwyC2HFXl7HfjOH-r8PE6zp-ZZnDNgR3k16cnprXt_IbDmHbjsq2q_nbO8aaBGz5Bv0qZD3ktVhbuXiYXx9sfjU2JM1v0yFbWtj")' }}
            ></div>
            <div className="flex flex-col flex-1 justify-between pt-0 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">Yeni Test Rotası</p>
                <p className="text-sm text-accent font-bold">⭐ 5.0 <span className="text-gray-400 font-normal">(1)</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-colors">ROTA DETAY</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DiscoveredRoutes;