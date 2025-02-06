import puppeteer from "puppeteer";

export async function betmgm(leagues) {

const browser = await puppeteer.launch({headless: false, defaultViewport: false});
//const browser = await puppeteer.launch({defaultViewport:false});


const page = await browser.newPage();
const oddsData = [];
// for loop
for (let i = 0; i < leagues.length; i++) {
   await page.goto(leagues[i]);
   const selector = 'ms-six-pack-event';
   await page.waitForSelector(selector);
   const rows = await page.$$(selector);
   const newRows = (i == 1) ? rows.slice(0, -6) : rows;
   
   
for (const row of newRows) {
    try {
        const away = await row.$eval('.participant', (el) => el.textContent.trim());
        const date = await row.$eval('.grid-event-header-wrapper', (el) => el.textContent.trim());
        const awayOdds = await row.$eval('ms-option-group:nth-child(3) span', (el) => el.textContent.trim());
        const home = await row.$eval('.participant-wrapper:nth-child(2) .participant', (el) => el.textContent.trim());
        const homeOdds = await row.$eval('ms-option-group:nth-child(3) ms-option:nth-child(2) span', (el) => el.textContent.trim());
        oddsData.push({
            date,
            home,
            homeOdds,
            away,
            awayOdds,
            ncaa: leagues[i] == 'https://sports.az.betmgm.com/en/sports/basketball-7/betting/usa-9/ncaa-264',
        });
        
    } catch (err) {
        console.error('Error extracting data for a row:', err.message);
    }

}
//end loop
}
await browser.close();
return oddsData;

}

























