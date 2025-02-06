
import puppeteer from "puppeteer";

export async function draftkings(leagues){
const browser = await puppeteer.launch();

const page = await browser.newPage();
const oddsData = [];
const retData = [];

for (let i = 0; i < leagues.length; i++) {
let homeBool = false;
await page.goto(leagues[i]);
const cols = await page.$$('.parlay-card-10-a');

for (const col of cols) {
    try {
    const date = await col.$eval('.sportsbook-table-header__title', (el) => el.textContent.trim());
    const rows = await col.$$('.sportsbook-table__body tr');
    
    for (const row of rows) {
        try {
          const team = await row.$eval('.event-cell__name-text', (el) => el.textContent.trim());
          
          
          const moneyline = await row.$eval('td:nth-child(4) span', (el) => el.textContent.trim());
    
          // Push extracted data into the array
          oddsData.push({
            date,
            team,
            moneyline,
            homeBool,
          });
          homeBool = !homeBool;
        } catch (err) {
          console.error('Error extracting data for a row:', err.message);
        }
        
      }

    } catch (e) {
        console.error('Error extracting date for a column:', e.message);
    }
    

}



let away = '';
let awayOdds = '';
for (const odds of oddsData) {
   if (!odds.homeBool) {
        away = odds.team;
        awayOdds = odds.moneyline;
   } else {
        retData.push({
            date: odds.date,
            home: odds.team,
            homeOdds: odds.moneyline,
            away: away,
            awayOdds: awayOdds,
        });
   }

}
}
await browser.close();
return retData;

}
