import puppeteer from "puppeteer";
//remember caesers team meta data
const browser = await puppeteer.launch({headless: false, defaultViewport: false,});

const page = await browser.newPage();

// page.on("response", async (response) => {
//     const url = response.url();
//     if (response.request().method() !== 'OPTIONS' && url.includes('/brands/czr/sb/v3/events/')) {
        
//         try {
//             const data = await response.json();
//             console.log(data);
//         } catch (error) {
//             console.error('Error reading response body:', error.message);
//         }
//     }
// });


await page.goto("https://sportsbook.caesars.com/us/az/bet/basketball/events");

const selector = '.eventList .EventCard';
await page.waitForSelector(selector);
const rows = await page.$$(selector);

console.log(rows);