const cheerio = require('cheerio');

async function scrape() {
  const res = await fetch("https://fbref.com/en/", {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // They usually have an id like trending
  const trendingPlayers = [];
  $('div[id*="trending"] a, div[class*="trending"] a').each((i, el) => {
     trendingPlayers.push($(el).text().trim());
  });
  
  console.log("Found trending links:", trendingPlayers.slice(0, 20));
}
scrape();
