import puppeteer from "puppeteer";

export async function dexwin(leagues) {
    
const browser = await puppeteer.launch(); 
//const browser = await puppeteer.launch({ headless: false, defaultViewport: false });

const page = await browser.newPage();
const oddsData = [];
for (let i = 0; i < leagues.length; i++){
await page.goto(leagues[i], { waitUntil: "networkidle2" });
await page.waitForSelector(".odds-btn .subtle-s", { visible: true });

const selector = '.flex-col.g-4.w-full  .pb-3.morepluscard';

await page.waitForSelector(selector);
const rows = await page.$$(selector);


for (const row of rows) {
    try {
        const date = await row.$eval('.small-s', (el) => el.textContent.trim());
        const away = await row.$eval('.flex-row-res.g-3.p-1.pl-2 div', (el) => el.textContent.trim());
        const home = await row.$eval('.flex-row-res.g-3.p-1.pl-2 div:nth-child(3)', (el) => el.textContent.trim());
        const awayOdds = await row.$eval('.oddbtn-cont .odds-btn .t5', (el) => el.textContent.trim());
        const homeOdds = await row.$eval('.oddbtn-cont .odds-btn:nth-child(2) .t5', (el) => el.textContent.trim());
        oddsData.push({
            date,
            home,
            homeOdds,
            away,
            awayOdds,
            league: leagues[i].slice(-3),
        });
    } catch (e) {
        console.error('Error extracting data for a row:', e.message);
    }
}
}//end loop
    await browser.close();
    return oddsData;
}