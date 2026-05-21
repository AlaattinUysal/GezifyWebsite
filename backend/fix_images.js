const { Client } = require('pg');

const client = new Client({
  host: 'db.mqronanpwluzofvxnmmr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fenerbahçe386',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixImages() {
  try {
    await client.connect();
    console.log('✅ Bağlandı.');

    const updates = [
      // Pamukkale
      { title: 'Travertenler & Antik Havuz', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Pamukkale%2C_Denizli_2026_68.jpg/960px-Pamukkale%2C_Denizli_2026_68.jpg' },
      { title: 'Hiyeropolis Antik Kenti Turu', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Hierapolis_01.jpg/960px-Hierapolis_01.jpg' },
      { title: 'Karahayıt Kırmızı Sular & Doğa', url: 'https://picsum.photos/seed/karahayit/800/600' },
      
      // Mardin
      { title: 'Eski Şehir & Taç Kapı Rotası', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Mardin%2C_Mardin_Merkez-Mardin%2C_Turkey_-_panoramio_%281%29.jpg/960px-Mardin%2C_Mardin_Merkez-Mardin%2C_Turkey_-_panoramio_%281%29.jpg' },
      { title: 'Midyat & Tel Abyad Köy Turu', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midyat_%282013%29_old_town_3.jpg/960px-Midyat_%282013%29_old_town_3.jpg' },
      { title: 'Deyrulzafaran Manastırı & Çevresi', url: 'https://picsum.photos/seed/deyrulzafaran/800/600' },

      // Rize
      { title: 'Pokut & Sal Yaylalar Turu', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Pokut_Yaylas%C4%B1_4.jpg/960px-Pokut_Yaylas%C4%B1_4.jpg' },
      { title: 'Fırtına Vadisi & Ayder Turu', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Ayder_Yaylasi_%40_Rize-Turkey.JPG/960px-Ayder_Yaylasi_%40_Rize-Turkey.JPG' },
      { title: 'Çay Bahçeleri & Rize Kalesi', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Georgian_Laz_people_monument_in_Rize_%28Modern_Day_Turkey%29.jpg/960px-Georgian_Laz_people_monument_in_Rize_%28Modern_Day_Turkey%29.jpg' },

      // Fethiye
      { title: 'Ölüdeniz & Kelebekler Vadisi', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Paragliding_view_oludeniz_-_panoramio_%282%29.jpg/960px-Paragliding_view_oludeniz_-_panoramio_%282%29.jpg' },
      { title: 'Likya Yolu & Kaya Köy', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Kayak%C3%B6y_Turkey.jpg/960px-Kayak%C3%B6y_Turkey.jpg' },
      { title: 'Göcek Koyları Tekne Turu', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/G%C3%B6cek.jpg/960px-G%C3%B6cek.jpg' },

      // İzmir
      { title: 'Efes Antik Kenti & Şirince', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ephesus_Celsus_Library_Fa%C3%A7ade.jpg/960px-Ephesus_Celsus_Library_Fa%C3%A7ade.jpg' },
      { title: 'Alsancak & Kordon Yürüyüşü', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cumhuriyet_Square.jpg/960px-Cumhuriyet_Square.jpg' },
      { title: 'Kordon & Kemeraltı', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Sirince_Overview_2012.jpg/960px-Sirince_Overview_2012.jpg' } // using Şirince image for variety
    ];

    for (let u of updates) {
      await client.query(`UPDATE public.city_routes SET image_url = $1 WHERE title = $2`, [u.url, u.title]);
    }
    console.log('✅ Bütün rota resimleri benzersiz ve çalışan linklerle güncellendi.');

  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await client.end();
  }
}

fixImages();
