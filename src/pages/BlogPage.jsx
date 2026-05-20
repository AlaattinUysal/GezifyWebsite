import React, { useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const mockPosts = [
  {
    id: 1,
    title: 'Kapadokya Balon Turu: Bilmeniz Gereken Her Şey',
    description: "Kapadokya benzersiz peribacaları ve balon turlarıyla ünlüdür. İşte mükemmel bir balon turu planlamak için eksiksiz rehberiniz.",
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1470&auto=format&fit=crop',
    category: 'Doğa Gezileri',
  },
  {
    id: 2,
    title: 'Ege\'nin Gizli Kalmış 5 Muhteşem Koyu',
    description: 'Kalabalıklardan uzakta, Ege\'nin henüz keşfedilmemiş ve huzur dolu koylarını keşfedin.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1470&auto=format&fit=crop',
    category: 'Yaz Tatili',
  },
  {
    id: 3,
    title: 'İstanbul Tarihi Yarımada: Bir Günde Nasıl Gezilir?',
    description: 'İstanbul\'un en önemli tarihi noktalarını tek bir günde keşfetmek için kompakt ve verimli bir rota.',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1514&auto=format&fit=crop',
    category: 'Tarihi Yerler',
  },
  {
    id: 4,
    title: 'Karadeniz Yaylalarında Unutulmaz Bir Hafta Sonu',
    description: 'Karadeniz\'in yemyeşil yaylalarında doğayla iç içe, huzur dolu bir hafta sonu kaçamağı deneyimi.',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Doğa Gezileri',
  },
  {
    id: 5,
    title: 'Ankara\'da Mutlaka Görülmesi Gereken 10 Müze',
    description: 'Antik çağ eserlerinden modern sanata kadar, Ankara\'nın sunduğu en iyi müzeleri ve sergileri keşfedin.',
    image: 'https://images.pexels.com/photos/208636/pexels-photo-208636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Şehir Rehberleri',
  },
  {
    id: 6,
    title: 'İzmir Sokak Lezzetleri Rehberi',
    description: 'Boyozdan kumruya, İzmir\'in renkli ve lezzetli sokak yemeği kültürünü yerinde keşfedin.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1287&auto=format&fit=crop',
    category: 'Gurme Rotalar',
  },
  {
    id: 7,
    title: 'Antalya\'nın Saklı Şelaleleri',
    description: 'Yaz sıcağından kaçmak ve doğanın serin sularında huzur bulmak için Antalya\'nın az bilinen şelaleleri.',
    image: 'https://images.pexels.com/photos/1564825/pexels-photo-1564825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Doğa Gezileri',
  },
  {
    id: 8,
    title: 'Gaziantep Lezzet Haritası',
    description: 'Baklavadan kebaba, UNESCO yaratıcı şehirler ağında bulunan Gaziantep\'te ne nerede yenir?',
    image: 'https://images.pexels.com/photos/4033281/pexels-photo-4033281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Gurme Rotalar',
  },
  {
    id: 9,
    title: 'Göbeklitepe\'nin Binlerce Yıllık Sırları',
    description: 'Tarihin sıfır noktası olarak kabul edilen Şanlıurfa Göbeklitepe\'de zamanda unutulmaz bir yolculuk.',
    image: 'https://images.pexels.com/photos/3310086/pexels-photo-3310086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Tarihi Yerler',
  },
  {
    id: 10,
    title: 'Yedigöller Sonbahar Kamp Rehberi',
    description: 'Sarı ve turuncunun her tonunu görebileceğiniz Bolu Yedigöller\'de doğa fotoğrafçılığı ve kamp ipuçları.',
    image: 'https://images.pexels.com/photos/2416551/pexels-photo-2416551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Doğa Gezileri',
  },
  {
    id: 11,
    title: 'Bozcaada Hafta Sonu Kaçamağı',
    description: 'Taş sokaklar, üzüm bağları ve Ege rüzgarıyla Bozcaada\'da 2 günlük harika bir plan.',
    image: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Yaz Tatili',
  },
  {
    id: 12,
    title: 'Eskişehir Odunpazarı Evleri ve Müzeler',
    description: 'Tarihi dokusu, cam sanatları ve modern müzeleriyle Eskişehir\'i tam anlamıyla keşfedin.',
    image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Şehir Rehberleri',
  },
  {
    id: 13,
    title: 'Rize Ayder Yaylası Bulutların Üzerinde',
    description: 'Kaçkar Dağları\'nın eteklerinde temiz hava, tulum sesi ve şifalı kaplıcalarıyla Ayder gezi rehberi.',
    image: 'https://images.pexels.com/photos/2674144/pexels-photo-2674144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Doğa Gezileri',
  },
  {
    id: 14,
    title: 'Efes Antik Kenti ve Celsus Kütüphanesi',
    description: 'Roma döneminin en büyük liman kentlerinden biri olan İzmir Selçuk\'taki Efes Antik Kenti turu.',
    image: 'https://images.pexels.com/photos/2087265/pexels-photo-2087265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Tarihi Yerler',
  },
  {
    id: 15,
    title: 'Hatay Sokak Lezzetleri',
    description: 'Tepsi kebabından künefeye, medeniyetler şehri Antakya\'nın sokak aralarındaki eşsiz lezzet durakları.',
    image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Gurme Rotalar',
  },
  {
    id: 16,
    title: 'Mardin Dar Sokakları ve Taş Evleri',
    description: 'Mezopotamya ovasına nazır, eşsiz taş işçiliği ve kültürel zenginliğiyle büyülü şehir Mardin.',
    image: 'https://images.pexels.com/photos/16125028/pexels-photo-16125028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Şehir Rehberleri',
  },
  {
    id: 17,
    title: 'Salda Gölü: Türkiye\'nin Maldivleri',
    description: 'Bembeyaz kumsalları ve turkuaz suyuyla eşsiz bir doğa harikası olan Salda Gölü kamp rehberi.',
    image: 'https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Doğa Gezileri',
  },
  {
    id: 18,
    title: 'Şirince Köyü Hafta Sonu Molası',
    description: 'Meyve şarapları ve restore edilmiş tarihi Rum evleriyle İzmir Şirince\'de huzurlu bir gün.',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Şehir Rehberleri',
  }
];

const categories = ["Tümü", "Doğa Gezileri", "Tarihi Yerler", "Gurme Rotalar", "Şehir Rehberleri"];
const tags = ["haftasonu", "doğa", "müze", "ücretsiz", "istanbul", "kamp"];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtreleme mantığı
  const filteredPosts = activeCategory === "Tümü" 
    ? mockPosts 
    : mockPosts.filter(post => post.category === activeCategory);

  // Sayfalama mantığı (Sayfa başı 6 gönderi)
  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Kategori değiştiğinde ilk sayfaya dön
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 font-display flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* HERO KISMI */}
        <div className="py-8">
          <div 
            className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-2xl items-center justify-center p-6 sm:p-12 shadow-lg" 
            style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1500&auto=format&fit=crop")' }}
          >
            <div className="flex flex-col gap-4 text-center max-w-3xl">
              <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                Gezify Blog: Seyahat İlhamı ve Rotalar
              </h1>
              <h2 className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed drop-shadow-sm">
                Muhteşem yerleri keşfedin, kendi rotalarınızı oluşturun ve diğer gezginlerle etkileşime geçin.
              </h2>
            </div>
            <button className="mt-4 flex cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 transition-colors text-white text-base font-bold tracking-wide shadow-lg shadow-primary/30">
              <span className="truncate">Blog'u Keşfet</span>
            </button>
          </div>
        </div>

        {/* KATEGORİLER */}
        <div className="flex gap-3 py-4 flex-wrap items-center">
          <p className="text-gray-800 dark:text-gray-300 text-sm font-semibold mr-2">Kategoriler:</p>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-bold' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm leading-normal">{cat}</p>
            </button>
          ))}
        </div>

        {/* ETLİKETLER (TAGS) */}
        <div className="flex gap-3 pb-6 flex-wrap items-center">
          <p className="text-gray-800 dark:text-gray-300 text-sm font-semibold mr-2">Etiketler:</p>
          {tags.map((tag) => (
            <button 
              key={tag}
              className="flex h-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 hover:border-primary/50 hover:text-primary transition-colors"
            >
              <p className="text-sm font-medium leading-normal text-gray-600 dark:text-gray-400 hover:text-primary">#{tag}</p>
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div key={post.id} className="flex flex-col gap-4 group cursor-pointer">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-md" 
                  style={{ backgroundImage: `url("${post.image}")` }}
                >
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-gray-900 dark:text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-relaxed mt-2 line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary text-sm font-bold leading-normal flex items-center gap-1 group-hover:underline">
                    Devamını Oku
                    <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                  </span>
                  <span className="text-xs font-medium text-gray-400">5 dk okuma</span>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Bu kategoride henüz yazı bulunmuyor.
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-12">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex size-10 items-center justify-center rounded-full transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-sm leading-normal flex size-10 items-center justify-center rounded-full transition-colors ${
                  currentPage === i + 1 
                    ? 'font-bold text-white bg-primary shadow-md shadow-primary/20' 
                    : 'font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex size-10 items-center justify-center rounded-full transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">chevron_right</span>
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="mx-auto w-full max-w-[1200px] p-6 py-10 lg:py-12">
          <div className="md:flex md:justify-between gap-12">
            <div className="mb-8 md:mb-0 max-w-sm">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">explore</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Gezify</h2>
              </Link>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Kendi seyahat hikayenizi yazmaya hazır mısınız? Binlerce rotayı keşfedin ve yolculuğunuzu planlayın.
              </p>
              <Link to="/yeni-rota" className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl h-10 px-6 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
                Rota Oluştur
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-bold text-gray-900 uppercase dark:text-white tracking-wider">Keşfet</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                  <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link to="/rotalar" className="hover:text-primary transition-colors">Popüler Rotalar</Link></li>
                  <li><Link to="/yeni-rota" className="hover:text-primary transition-colors">Harita</Link></li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-bold text-gray-900 uppercase dark:text-white tracking-wider">Sosyal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                  <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Twitter (X)</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-bold text-gray-900 uppercase dark:text-white tracking-wider">Yasal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                  <li><a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Kullanım Şartları</a></li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-100 dark:border-gray-800 sm:mx-auto" />
          <div className="sm:flex sm:items-center sm:justify-between text-center sm:text-left">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              © 2026 <Link to="/" className="hover:text-primary transition-colors">Gezify™</Link>. Tüm Hakları Saklıdır.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;