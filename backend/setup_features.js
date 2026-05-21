const { Client } = require('pg');

const client = new Client({
  host: 'db.mqronanpwluzofvxnmmr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fenerbahçe386',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  try {
    await client.connect();
    console.log('✅ Bağlandı.');

    // 1. Şehir rotaları (hazır/önerilen rotalar)
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.city_routes (
        id SERIAL PRIMARY KEY,
        city TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        stops TEXT[], -- durak isimleri dizisi
        image_url TEXT,
        duration TEXT,
        difficulty TEXT DEFAULT 'Kolay',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ city_routes tablosu oluşturuldu.');

    // 2. Favoriler
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.user_favorites (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        city_route_id INT REFERENCES public.city_routes(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, city_route_id)
      );
    `);
    console.log('✅ user_favorites tablosu oluşturuldu.');

    // 3. Değerlendirmeler
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.user_ratings (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        city_route_id INT REFERENCES public.city_routes(id) ON DELETE CASCADE,
        rating SMALLINT CHECK (rating >= 0 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, city_route_id)
      );
    `);
    console.log('✅ user_ratings tablosu oluşturuldu.');

    // 4. Seed: Örnek şehir rotaları
    await client.query(`
      INSERT INTO public.city_routes (city, title, description, stops, image_url, duration, difficulty) VALUES
      ('İstanbul', 'Tarihi Yarımada Turu', 'Osmanlı''nın izlerini takip eden eşsiz bir tarih turu.', ARRAY['Ayasofya','Sultanahmet Camii','Yerebatan Sarnıcı','Topkapı Sarayı','Kapalıçarşı'], 'https://media.cntravellerme.com/photos/6867aeba85cc078a3f1e5ad3/1:1/w_2160,h_2160,c_limit/1480863367', '6 saat', 'Kolay'),
      ('İstanbul', 'Boğaz & Beyoğlu Rotası', 'Boğaz''ın büyüleyici manzarası eşliğinde modern İstanbul.', ARRAY['Ortaköy','Beşiktaş','Taksim','Galata Kulesi','Balık Ekmek'], 'https://ptimages.s3.eu-west-2.amazonaws.com/img/media_photos/why_is_antalya_so_popular-jpg.webp', '5 saat', 'Kolay'),
      ('İstanbul', 'Adalar Günübirlik Tur', 'Arabasız adaların huzurunu keşfet.', ARRAY['Kabataş İskelesi','Büyükada','Heybeliada','Kınalıada'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Buyukada_-_panoramio.jpg/1200px-Buyukada_-_panoramio.jpg', '8 saat', 'Orta'),
      ('İstanbul', 'Anadolu Yakası Turu', 'Kadıköy''den Üsküdar''a Asya yakasının en iyileri.', ARRAY['Kadıköy Çarşısı','Moda Sahili','Kız Kulesi','Üsküdar Meydanı'], 'https://cdn.britannica.com/34/10734-050-29C0B3FE/Clock-tower-Izmir-Turkey.jpg', '4 saat', 'Kolay'),
      ('İstanbul', 'Gece İstanbul Turu', 'İstanbul''un gece hayatı ve ışıltılı manzaraları.', ARRAY['Galata Köprüsü','Eminönü','Karaköy','Tünel','İstiklal Caddesi'], 'https://artuklu.bel.tr/tema/genel/uploads/sayfalar/buyuk-mardin-otelinden.jpg', '3 saat', 'Kolay'),
      ('Antalya', 'Kaleiçi & Antik Liman', 'Roma surları ve antik liman arasında tarihi bir yürüyüş.', ARRAY['Kaleiçi','Hadriyen Kapısı','Antik Liman','Saat Kulesi'], 'https://ptimages.s3.eu-west-2.amazonaws.com/img/media_photos/why_is_antalya_so_popular-jpg.webp', '4 saat', 'Kolay'),
      ('Antalya', 'Konyaaltı & Düden Şelalesi', 'Plaj ve doğanın buluştuğu ferahlatıcı bir tur.', ARRAY['Konyaaltı Sahili','Atatürk Parkı','Düden Şelalesi'], 'https://www.pamukkale.com.tr/images/sehirler/denizli.jpg', '5 saat', 'Orta'),
      ('Kapadokya', 'Peri Bacaları & Vadiler', 'Kapadokya''nın mistik dünyasını keşfet.', ARRAY['Göreme','Uçhisar Kalesi','Güvercinlik Vadisi','Çavuşin'], 'https://wp.oggusto.com/wp-content/uploads/2025/04/kapadokya-gun-dogumu-sicak-hava-balonlari-peribacalari.webp', '7 saat', 'Zor'),
      ('Kapadokya', 'Balon Turu & Yeraltı Şehri', 'Gökyüzünden Kapadokya, sonra derinlere iniş.', ARRAY['Balon Kalkış Noktası','Derinkuyu Yeraltı Şehri','Ortahisar'], 'https://wp.oggusto.com/wp-content/uploads/2025/04/kapadokya-gun-dogumu-sicak-hava-balonlari-peribacalari.webp', '8 saat', 'Orta'),
      ('İzmir', 'Kordon & Kemeraltı', 'İzmir''in incisi: deniz kıyısı ve tarihi çarşı.', ARRAY['Kordon','Kemeraltı Çarşısı','Saat Kulesi','Asansör'], 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Izmir_Kordon_2012.jpg/1200px-Izmir_Kordon_2012.jpg', '5 saat', 'Kolay')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Örnek rotalar eklendi.');

    // RLS kapat
    await client.query(`ALTER TABLE public.city_routes DISABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE public.user_favorites DISABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE public.user_ratings DISABLE ROW LEVEL SECURITY;`);
    console.log('✅ RLS devre dışı bırakıldı.');

  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await client.end();
  }
}

setup();
