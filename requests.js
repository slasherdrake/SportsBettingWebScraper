import puppeteer from "puppeteer";

const browser = await puppeteer.launch({headless: false, defaultViewport: false});

const page = await browser.newPage();

const matchupHomeMap = new Map(); 
const matchupAwayMap = new Map();
const moneylineHomeMap = new Map(); 
const moneylineAwayMap = new Map();
const teamMoneylineMap = new Map();


//await page.goto("https://www.pinnacle.com/en/" + sport + "/" + league + "/matchups");



page.on("response", async (response) => {
    const url = response.url();
    if (response.request().method() !== 'OPTIONS' && url.includes('/matchups')) {
        console.log('Response:', url);
        console.log('Status:', response.status());
        console.log('Headers:', response.headers());
        try {
            const data = await response.json();
            if (data){
                const dataMap = data.map(entry => {
                    return {
                        matchupId: entry.id,
                        participants: entry.participants,
                        hasMoneyline: entry.periods[0].hasMoneyline,
                        startTime: entry.startTime,
                    }
                })
                const filtered = dataMap.filter(entry => entry.hasMoneyline);
                const data2 = filtered.map(entry => {
                    return {
                        matchupId: entry.matchupId,
                        homeTeam: entry.participants[0].name + '-' + entry.startTime,
                        awayTeam: entry.participants[1].name + '-' + entry.startTime,
                        
                    }
                });
                for (const x of data2) {
                    matchupHomeMap.set(x.matchupId, x.homeTeam);
                    matchupAwayMap.set(x.matchupId, x.awayTeam);
                }
            
            }
            
        } catch (error) {
            console.error('Error reading response body:', error.message);
        }
    }
});
page.on("response", async (response) => {
    const url = response.url();
    if (response.request().method() !== 'OPTIONS' && url.includes('/markets')) {
        console.log('Response:', url);
        console.log('Status:', response.status());
        console.log('Headers:', response.headers());
        try {
            const dataX = await response.json();
            if (dataX){
                const dataFilteredX = dataX.map(entry => {
                    return {
                    matchupId: entry.matchupId,
                    period: entry.period,
                    prices: entry.prices,
                    type: entry.type,
                    }
    
                })
                const filtered2X = dataFilteredX.filter(entry => entry.type == "moneyline" && entry.period == 0);
                const filtered3X = filtered2X.map(entry => {
                    return {
                        matchupId: entry.matchupId,
                        homeTeam: entry.prices[0].price,
                        awayTeam: entry.prices[1].price,
                    }
                })
                for (const y of filtered3X){
                    moneylineHomeMap.set(y.matchupId, y.homeTeam);
                    moneylineAwayMap.set(y.matchupId, y.awayTeam);
                }
            }   
        } catch (error) {
            console.error('Error reading response body:', error.message);
        }
    }
})





await page.goto("https://www.pinnacle.com/en/football/nfl/matchups");
await page.goto("https://www.pinnacle.com/en/basketball/nba/matchups");
await page.goto("https://www.pinnacle.com/en/football/ncaa/matchups");
//await page.goto("https://www.pinnacle.com/en/hockey/nhl/matchups");
await page.waitForSelector('.gameInfoLabel-EDDYv5xEfd', {visible:true});

await page.waitForSelector('.gameInfoLabel-EDDYv5xEfd', {visible:true});

await browser.close();


for (const [key, value] of matchupHomeMap) {
    teamMoneylineMap.set(value, moneylineHomeMap.get(key));
}
for (const [key, value] of matchupAwayMap) {
    teamMoneylineMap.set(value, moneylineAwayMap.get(key));
}

console.log(teamMoneylineMap);


