const https = require('https');

const urls = [
  "https://upload.wikimedia.org/wikipedia/commons/4/4f/Galata_Tower_%282%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/22/Hagia_Sophia_Mars_2013.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c1/Sultan_Ahmed_Mosque_Istanbul_Turkey_retouched.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Topkap%C4%B1_-_panoramio_%281%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8e/Grand_Bazaar_Istanbul_2007.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0e/Kiz_Kulesi%2C_Istanbul.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3e/Dolmabah%C3%A7e_Palace.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f0/Basilica_Cistern_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Galata_Tower_%282%29.jpg/800px-Galata_Tower_%282%29.jpg"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url}: ERROR ${e.message}`);
  });
});
