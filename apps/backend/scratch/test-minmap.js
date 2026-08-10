const axios = require('axios');
const cheerio = require('cheerio');

async function testMinmap() {
  try {
    const res = await axios.get('https://minmap.cm', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);
    console.log('MINMAP Title:', $('title').text());

    $('a').each((i, element) => {
      const text = $(element).text().trim();
      const href = $(element).attr('href');
      if (text && (text.toLowerCase().includes('offre') || text.toLowerCase().includes('marché') || text.toLowerCase().includes('appel'))) {
        console.log(`[${i}] ${text} -> ${href}`);
      }
    });
  } catch (err) {
    console.error('MINMAP Error:', err.message);
  }
}

testMinmap();
