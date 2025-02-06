import puppeteer from "puppeteer";

const browser = await puppeteer.launch();

const page = await browser.newPage();

await page.goto("https://www.az.bet365.com/?_h=r23xtRf5dnUh0mGnMboOUA%3D%3D&btsffd=1#/AC/B18/C20604387/D48/E1453/F10/");