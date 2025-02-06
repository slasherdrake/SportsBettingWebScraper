import puppeteer from "puppeteer";

export async function polymarket(leagues){

const browser = await puppeteer.launch({defaultViewport: false});
//const browser = await puppeteer.launch({ headless: false, defaultViewport: false });
const oddsData = [];
const page = await browser.newPage();
for (let i = 0; i < leagues.length; i++) {
await page.goto(leagues[i]);

const selector = '.c-doTiuE li';
await page.waitForSelector(selector);
const rows = await page.$$(selector);
const firstRows = rows.slice(0,10);

await page.locator('input.c-ecshmo').fill('100');

let date = null;

for (const row of firstRows) {
    try {
        let home = null;
        let away = null;
        let homeOdds= null;
        let awayOdds = null;
        const clickableElementAway = await row.$('.c-PJLV-ibPNjhd-css');
        const clickableElementHome = await row.$('.c-PJLV-ibPNjhd-css:nth-child(2)');
        if (clickableElementAway) {
            await clickableElementAway.click();
            const teamSelector = '.c-dqzIym-ihttiXo-css';
            await page.waitForSelector(teamSelector);
            away = await page.$eval(teamSelector, (el) => el.textContent.trim());
            awayOdds = await page.$eval('.c-dqzIym-ijFEPkm-css', (el) => el.textContent.trim());


        } if (clickableElementHome) {
            await clickableElementHome.click();
            const teamSelector = '.c-dqzIym-ihttiXo-css';
            home = await page.$eval(teamSelector, (el) => el.textContent.trim());
            
            homeOdds = await page.$eval('.c-dqzIym-ijFEPkm-css', (el) => el.textContent.trim());
     } else {
            date = await row.$eval('p', (el) => el.textContent.trim());
            continue;
        }
        oddsData.push({
            date, 
            home,
            homeOdds,
            away,
            awayOdds,
        });
    }
    catch (e) {
        console.error('Error extracting data for a row:', e.message);
    }

}
}

await browser.close();

return oddsData;

}
