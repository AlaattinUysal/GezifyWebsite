const { Client } = require('pg');

const client = new Client({
  host: 'db.mqronanpwluzofvxnmmr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fenerbahçe386',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function addRoutes() {
  try {
    await client.connect();
    console.log('✅ Bağlandı.');

    await client.query(`
      INSERT INTO public.city_routes (city, title, description, stops, image_url, duration, difficulty) VALUES

      -- PAMUKKALE
      ('Pamukkale', 'Travertenler & Antik Havuz', 'Dünyanın en büyük kireçtaşı teraslarında yürüyüş ve Kleopatra''nın antik termal havuzu.', ARRAY['Pamukkale Girişi','Travertenler','Antik Havuz','Hiyeropolis Amfitiyatrosu'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pamukkale_2.jpg/1200px-Pamukkale_2.jpg', '5 saat', 'Kolay'),
      ('Pamukkale', 'Hiyeropolis Antik Kenti Turu', 'Roma döneminden kalma tiyatro, nekropol ve antik cadde boyunca tarih yolculuğu.', ARRAY['Hiyeropolis Kapısı','Antik Cadde','Nekropol','Bizans Kilisesi','Roma Tiyatrosu'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pamukkale_2.jpg/1200px-Pamukkale_2.jpg', '4 saat', 'Orta'),
      ('Pamukkale', 'Karahayıt Kırmızı Sular & Doğa', 'Demir mineralli kırmızı termal sular ve bölgenin doğal güzellikleri.', ARRAY['Karahayıt Köyü','Kırmızı Su Kaynakları','Termal Havuz','Çamur Banyosu'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pamukkale_2.jpg/1200px-Pamukkale_2.jpg', '3 saat', 'Kolay'),

      -- MARDİN
      ('Mardin', 'Eski Şehir & Taç Kapı Rotası', 'Sarı taş konaklar, Süryani kiliseleri ve Mezopotamya''ya bakan eşsiz manzara.', ARRAY['Ulu Camii','Kasım Padişah Camii','Zinciriye Medresesi','Taç Kapı','Kumbet Camii'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mardin_Panorama.JPG/1200px-Mardin_Panorama.JPG', '5 saat', 'Kolay'),
      ('Mardin', 'Deyrulzafaran Manastırı & Çevresi', 'MS 5. yüzyıldan kalma dünyaca ünlü Süryani manastırı ve köy turları.', ARRAY['Deyrulzafaran Manastırı','Kırklar Kilisesi','Dara Antik Kenti'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mardin_Panorama.JPG/1200px-Mardin_Panorama.JPG', '6 saat', 'Orta'),
      ('Mardin', 'Midyat & Tel Abyad Köy Turu', 'Midyat''ın sarı taş evleri, telkari sanatı ve yöresel mutfak deneyimi.', ARRAY['Midyat Çarşısı','Telkari Atölyeleri','Estel Vadisi','Geleneksel Kahvaltı'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mardin_Panorama.JPG/1200px-Mardin_Panorama.JPG', '7 saat', 'Orta'),

      -- RİZE
      ('Rize', 'Fırtına Vadisi & Ayder Turu', 'Türkiye''nin en yeşil vadisi boyunca yürüyüş, sal rafting ve yaylalar.', ARRAY['Fırtına Vadisi','Ardeşen','Çamlıhemşin','Ayder Yaylası'], 'https://vagonatinyhouse.com/wp-content/uploads/2021/07/rize_rize-firtina-vadisi-8d5447-1170x650.jpg', '8 saat', 'Zor'),
      ('Rize', 'Çay Bahçeleri & Rize Kalesi', 'Dünyanın en kuzeydeki çay tarlaları ve tarihi kale manzarası.', ARRAY['Rize Çay Bahçeleri','Rize Kalesi','Zihni Derin Parkı','Rize Müzesi'], 'https://vagonatinyhouse.com/wp-content/uploads/2021/07/rize_rize-firtina-vadisi-8d5447-1170x650.jpg', '4 saat', 'Kolay'),
      ('Rize', 'Pokut & Sal Yaylalar Turu', 'Karadeniz''in en güzel yaylaları, cennet vadileri ve doğa yürüyüşü.', ARRAY['Pokut Yaylası','Sal Yaylası','Hacıvanak Yaylası'], 'https://vagonatinyhouse.com/wp-content/uploads/2021/07/rize_rize-firtina-vadisi-8d5447-1170x650.jpg', '7 saat', 'Zor'),

      -- FETHİYE
      ('Fethiye', 'Ölüdeniz & Kelebekler Vadisi', 'Dünyanın en güzel lagünü Ölüdeniz ve gizli cennet Kelebekler Vadisi.', ARRAY['Ölüdeniz Plajı','Belcekız','Kelebekler Vadisi','Paragliding Noktası'], 'https://dunyakentimugla.org/wp-content/uploads/2019/11/FETHIYE.webp', '6 saat', 'Orta'),
      ('Fethiye', 'Likya Yolu & Kaya Köy', 'UNESCO Dünya Mirası adayı Likya Yolu ve hayalet köy Kayaköy.', ARRAY['Kaya Köy','Gemiler Adası','Likya Yolu Başlangıcı','Günlüklü Koyu'], 'https://dunyakentimugla.org/wp-content/uploads/2019/11/FETHIYE.webp', '7 saat', 'Orta'),
      ('Fethiye', 'Göcek Koyları Tekne Turu', 'Yedi adalar arasında mavi yolculuk, kristal berraklığında deniz ve sakin koylar.', ARRAY['Göcek Limanı','İnlice Koyu','Hamam Koyu','Tersane Adası'], 'https://dunyakentimugla.org/wp-content/uploads/2019/11/FETHIYE.webp', '8 saat', 'Kolay'),

      -- İZMİR (Bozuk resimleri düzelt + yeni rotalar)
      ('İzmir', 'Alsancak & Kordon Yürüyüşü', 'İzmir''in kalbi: sahil boyunca yürüyüş, eski Levanten evleri ve Asansör.', ARRAY['Kordon','Alsancak Limanı','Tarihi Asansör','Kıbrıs Şehitleri Caddesi'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Izmir_Kordon_2012.jpg/1200px-Izmir_Kordon_2012.jpg', '3 saat', 'Kolay'),
      ('İzmir', 'Efes Antik Kenti & Şirince', 'Dünyanın en iyi korunmuş antik kentlerinden Efes ve şarap köyü Şirince.', ARRAY['Efes Antik Kenti','Celcus Kütüphanesi','Meryem Ana Evi','Şirince Köyü'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Izmir_Kordon_2012.jpg/1200px-Izmir_Kordon_2012.jpg', '8 saat', 'Orta')

      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Yeni rotalar eklendi.');

    // Eski bozuk İzmir resimlerini güncelle
    await client.query(`
      UPDATE public.city_routes
      SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Izmir_Kordon_2012.jpg/1200px-Izmir_Kordon_2012.jpg'
      WHERE city = 'İzmir';
    `);
    console.log('✅ İzmir resimleri güncellendi.');

  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await client.end();
  }
}

addRoutes();
