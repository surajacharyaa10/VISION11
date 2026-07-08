import puppeteer from 'puppeteer';

export async function searchPlayer(name: string) {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        const url = `https://www.playmakerstats.com/search.php?mo=1&q=${encodeURIComponent(name)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Very basic scraping, since playmakerstats search is complex,
        // we'll try to find the first player link
        const playerLink = await page.evaluate(() => {
            // Find a link that looks like /player/... or /player.php?id=...
            const links = Array.from(document.querySelectorAll('a[href*="/player/"], a[href*="player.php?id="]'));
            for (const link of links) {
                const text = link.textContent?.trim();
                const href = (link as HTMLAnchorElement).href;
                if (text && href) {
                    return { name: text, url: href };
                }
            }
            return null;
        });

        return { success: true, data: playerLink ? [playerLink] : [] };
    } catch (e: any) {
        console.error("Puppeteer Search Error:", e);
        return { success: false, error: e.message };
    } finally {
        await browser.close();
    }
}

export async function getPlayerDetails(url: string) {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const details = await page.evaluate(() => {
            const name = document.querySelector('h1')?.textContent?.trim();
            // Just some basic details for now
            return {
                name,
                // Add more details as we reverse-engineer the HTML
            };
        });

        return { success: true, data: details };
    } catch (e: any) {
        console.error("Puppeteer Details Error:", e);
        return { success: false, error: e.message };
    } finally {
        await browser.close();
    }
}
