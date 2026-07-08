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
  
  const players = [];
  $('a[href*="/players/"]').each((i, el) => {
     const href = $(el).attr('href');
     const text = $(el).text().trim();
     if(text && href && !href.includes('/matchlogs/') && text.length > 3 && !players.includes(text)) {
         players.push(text);
     }
  });
  
  console.log("Found players:", players.slice(0, 10));
}
scrape();
