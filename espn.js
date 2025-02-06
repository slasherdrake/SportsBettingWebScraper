import puppeteer from "puppeteer";

export async function espn(leagues) {
const browser = await puppeteer.launch();

const page = await browser.newPage();
const oddsData = [];
for (let i = 0; i < leagues.length;i++){
await page.goto(leagues[i],{waitUntil: 'networkidle2'});
const selector = '.space-y-4 .space-y-4 article'
await page.waitForSelector(selector, {visible:true});
const rows = await page.$$(selector);
//text-style-s-medium
//flex flex-col items-start


for (const row of rows) {
    const date = await row.$eval('span', (el) => el.textContent.trim());
    const away = await row.$eval('.flex.p-0 div .text-style-s-medium', (el) => el.textContent.trim());
    const home = await row.$eval('.flex.p-0 + .flex.p-0 .flex.flex-col.items-start .text-style-s-medium', (el) => el.textContent.trim());
    const awayOdds = await row.$eval('button + button + button', (el) => el.textContent.trim());
    const homeOdds = await row.$eval('.flex.p-0 + .flex.p-0 button + button + button', (el) => el.textContent.trim());
    oddsData.push({
        date,
        away,
        awayOdds,
        home,
        homeOdds,
        league: leagues[i].slice(-3),
    });
}

}//end loop

await browser.close();
return oddsData;

}
//#MarketplaceShelf\:6cf35d0d-145f-4803-9f4b-9cec4427ebfb > div:nth-child(2) > div > article:nth-child(1)