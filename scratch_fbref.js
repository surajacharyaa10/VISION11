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
  
  // Find trending players (usually in a div.trending or similar)
  // Let's print out all a tags under #trending or .trending
  
  const players = [];
  $('#trending_players a').each((i, el) => {
     players.push($(el).text().trim());
  });
  
  console.log("Trending Players container:", $('#trending_players').html());
  
  console.log("Found players:", players);
}
scrape();
