import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs';

async function test() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        await page.goto(`https://www.playmakerstats.com/search.php?mo=1&q=messi`, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const html = await page.content();
        fs.writeFileSync('test.html', html);
        console.log("HTML length:", html.length);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        if (browser) await browser.close();
    }
}

test();
