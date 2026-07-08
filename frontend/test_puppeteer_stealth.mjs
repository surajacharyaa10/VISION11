import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

async function test() {
    let browser;
    try {
        console.log("Launching browser");
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        console.log("Going to URL");
        await page.goto(`https://www.playmakerstats.com/player/lionel-messi?search=1`, { waitUntil: 'domcontentloaded', timeout: 15000 });

        console.log("Extracting");
        const players = await page.evaluate(() => {
            const results = [];
            const rows = document.querySelectorAll('.zztable tr');
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const link = row.querySelector('a[href*="player/"]');
                if (link) {
                    const text = link.textContent.trim();
                    const href = link.getAttribute('href');
                    results.push({ name: text, href });
                }
            }
            return results;
        });

        console.log("Players:", players);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        if (browser) await browser.close();
    }
}

test();
