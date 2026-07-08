import * as cheerio from 'cheerio';

async function test() {
    const response = await fetch('https://www.playmakerstats.com/search.php?mo=1&q=messi', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    console.log('Status:', response.status);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Attempt to extract players
    const results = [];
    $('.zztable tr').each((i, el) => {
        if (i === 0) return; // skip header
        const link = $(el).find('a[href*="player/"]').first();
        if (link.length) {
            results.push({
                name: link.text().trim(),
                href: link.attr('href')
            });
        }
    });
    console.log(results);
}

test();
