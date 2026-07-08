const cheerio = require('cheerio');

async function scrape() {
  const res = await fetch("https://fbref.com/en/comps/9/stats/Premier-League-Stats", {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const players = [];
  $('table#stats_standard tbody tr').each((i, el) => {
     const name = $(el).find('td[data-stat="player"] a').text().trim();
     if(name && players.length < 8) {
         players.push(name);
     }
  });
  
  console.log("Found players:", players);
}
scrape();
