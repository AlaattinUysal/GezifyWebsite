const https = require('https');
const url = `https://en.wikipedia.org/w/api.php?action=query&titles=Blue_Mosque,_Istanbul&prop=pageimages&format=json&pithumbsize=800`;
const options = { headers: { 'User-Agent': 'GezifyBot/1.0' } };
https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
