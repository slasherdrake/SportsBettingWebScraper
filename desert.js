import puppeteer from "puppeteer";

export async function desert() {
const browser = await puppeteer.launch({ headless: false, defaultViewport: false });
//const browser = await puppeteer.launch();
const page = await browser.newPage();
const oddsData = [];
for (let i = 0; i < 1; i++) {
if (i == 0) await page.goto('https://www.playdesertdiamond.com/en/sports/sports-hub/basketball/nba');
//if (i == 1) await page.goto('https://www.playdesertdiamond.com/en/sports/sports-hub/ice_hockey/nhl');
//if (i == 0) await page.goto('https://www.playdesertdiamond.com/en/sports/sports-hub/american_football/nfl');

const selector = '.KambiBC-sandwich-filter__list li';
await page.waitForSelector(selector);
const rows = await page.$$(selector);

for (const row of rows) {
    try {
        const date = await row.$eval('.KambiBC-event-item__match-clock-container', (el) => el.textContent.trim());
        const away = await row.$eval('.KambiBC-event-participants__name', (el) => el.textContent.trim());
        const home = await row.$eval('.KambiBC-event-participants__name:nth-child(2)', (el) => el.textContent.trim());
        const awayOdds = await row.$eval('.KambiBC-list-view__column:nth-child(2) button', (el) => el.textContent.trim());
        const homeOdds= await row.$eval('.KambiBC-list-view__column:nth-child(2) button:nth-child(2)', (el) => el.textContent.trim());
        oddsData.push({
            date,
            home,
            homeOdds,
            away,
            awayOdds
        });

    } catch (e) {
        console.error('Error extracting data for a row:', e.message);
    }

}

}//end loop
await browser.close();
    return oddsData;
}