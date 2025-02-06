import puppeteer from "puppeteer";

export async function betrivers(leagues) {
const browser = await puppeteer.launch();
let temp = 0;

const page = await browser.newPage();
let oddsData = [];
page.on("response", async (response) => {
    const url = response.url();
    if (response.request().method() !== 'OPTIONS' && url.includes('/api/service/sportsbook/offering/listview/events')) {
        
        try {
            const data = await response.json();
            
            if (data) {
                const newOddsData = data.items.map(entry => {
                    return {
                        date: entry.start,
                        home: entry.extendedFormatName[2],
                        away: entry.extendedFormatName[0],
                        homeOdds: entry.betOffers[1].outcomes[1].odds,
                        awayOdds: entry.betOffers[1].outcomes[0].odds,
                        ncaa: leagues[temp] == 'https://az.betrivers.com/?page=sportsbook&group=1000093654&type=matches',
                    }
                })
                oddsData = oddsData.concat(newOddsData);
            }
            
            
        } catch (error) {
            console.error('Error reading response body:', error.message);
        }
    }
});

for (let i = 0; i < leagues.length; i++) {
    await page.goto(leagues[i]);
    temp = i;
    await page.waitForSelector('article', {visible:true});
}

await browser.close();
return oddsData;
}