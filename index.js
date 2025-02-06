import {dexwin} from './dexwin.js';
import {espn} from './espn.js';
import {polymarket} from './polymarket.js';
import {desert} from './desert.js';
import {draftkings} from './draftkings.js';
import { betmgm } from './betmgm.js';
import {betrivers} from './betrivers.js';
const date = new Date();
const dayOfWeekIndex = date.getDay();
const month = date.getMonth() + 1;
const day = date.getDate();
const monthSlashDay = month + '/' + day;
const output = new Map();
const tomorrow = new Date(date);
tomorrow.setDate(date.getDate() + 1);
const tomorrowMonthSlashDay = (tomorrow.getMonth() + 1) + '/' + tomorrow.getDate();
/***************************** POLYMARKET ********************************/
const polymarketLinks = [
    'https://polymarket.com/sports/nba/games',
    'https://polymarket.com/sports/nhl/games',
    'https://polymarket.com/sports/nfl/games',
];
const polymarketResult = await polymarket(polymarketLinks);

for (const result of polymarketResult) {
    const key = getLastWord(result.away) + getLastWord(result.home) + monthToNum(getWord(result.date, 1)) + '/' + getWord(result.date, 3);
    const value = ["Polymarket:",polymarketOdds(result.awayOdds),"Polymarket:",polymarketOdds(result.homeOdds)];
    check(key,value);
}
console.log('length:',polymarketResult.length,'with polymarket:',output);
/***************************** ESPN ********************************/
const espnLinks = ['https://espnbet.com/sport/basketball/organization/united-states/competition/nba',
    'https://espnbet.com/sport/football/organization/united-states/competition/nfl',
    //'https://espnbet.com/sport/hockey/organization/united-states/competition/nhl',
    //'https://espnbet.com/sport/basketball/organization/united-states/competition/ncaab',
    //'https://espnbet.com/sport/mma/organization/ufc/competition/ufc-311',
]
const espnResult = await espn(espnLinks);
for (const result of espnResult) {
    const key = (result.league == 'ncaab') ? 
    noRanking(result.away) + noRanking(result.home) + espnDate(result.date) :
    getLastWord(result.away) + getLastWord(result.home) + espnDate(result.date);
    const value = ["ESPN:",even(result.awayOdds),"ESPN:",even(result.homeOdds)];
    check(key,value);
    
}
console.log('length:',espnResult.length,'with espn:',output);
/***************************** DEXWIN ********************************/
const dexwinLinks = [//'https://sportsbook.dexwin.bet/sportsbook/basketball/international-tournaments/nba',
//'https://sportsbook.dexwin.bet/sportsbook/basketball/international-tournaments/ncaa',
//'https://sportsbook.dexwin.bet/sportsbook/american-football/international-tournaments/nfl',
//'https://sportsbook.dexwin.bet/sportsbook/mma/international-tournaments/ufc'
];
const dexwinResult = await dexwin(dexwinLinks);
for (const result of dexwinResult) {
    const ufc = result.league == 'ufc'
    const key = (ufc) ?
    getLastWord(result.home) + getLastWord(result.away) + monthToNum(getWord(result.date,1)) + '/' + monthToNum(getWord(result.date,0))
    : getLastWord(result.away) + getLastWord(result.home) + monthToNum(getWord(result.date,1)) + '/' + monthToNum(getWord(result.date,0));
    const value = (ufc) ?
    ["Dexwin:",Number(result.homeOdds),"Dexwin:",Number(result.awayOdds)]
    : ["Dexwin:",Number(result.awayOdds),"Dexwin:",Number(result.homeOdds)];
    check(key, value);
}
console.log('length:',dexwinResult.length,'with dexwin:',output);
/***************************** DESERT DIAMOND ********************************/

// const desertResult = await desert();
// for (const result of desertResult){
//     const key = getLastWord(result.away) + getLastWord(result.home) + weekToDate(result.date);
//     const value = ["Desert Diamond:",americanToDecimal(result.awayOdds),"Desert Diamond:",americanToDecimal(result.homeOdds)];
//     check(key,value);
// }
// console.log('length:',desertResult.length,'with desert diamond:', output);

/***************************** BETRIVERS ********************************/
const betriversLinks = [//'https://az.betrivers.com/?page=sportsbook&group=1000093652&type=matches',
//'https://az.betrivers.com/?page=sportsbook&group=1000093657&type=matches',
//'https://az.betrivers.com/?page=sportsbook&group=1000093656&type=matches',
//'https://az.betrivers.com/?page=sportsbook&group=1000093654&type=matches',
]
const betriversResult = await betrivers(betriversLinks);
for (const result of betriversResult) {
    const key = (result.ncaa) ?
     noRanking(result.away) + noRanking(result.home) + utcToLocal(result.date)
     : getLastWord(result.away) + getLastWord(result.home) + utcToLocal(result.date);
    const value = ["Betrivers:",result.awayOdds,"Betrivers:",result.homeOdds];
    check(key,value);
}
console.log('length:',betriversResult.length,'with betrivers:', output);
/***************************** BETMGM ********************************/
const betmgmLinks = ['https://sports.az.betmgm.com/en/sports/basketball-7/betting/usa-9/nba-6004',
    'https://sports.az.betmgm.com/en/sports/hockey-12/betting/usa-9/nhl-34',
    'https://sports.az.betmgm.com/en/sports/football-11/betting/usa-9/nfl-35',
    //'https://sports.az.betmgm.com/en/sports/basketball-7/betting/usa-9/ncaa-264',
    //'https://sports.az.betmgm.com/en/sports/mma-45',
]
const betmgmResult = await betmgm(betmgmLinks);
for (const result of betmgmResult) {
    const key = (result.ncaa) ? 
    result.away + result.home + mgmDate(getWord(result.date,0))
    : getLastWord(result.away) + getLastWord(result.home) + mgmDate(getWord(result.date,0));
    const value = ["BetMGM:",americanToDecimal(result.awayOdds),"BetMGM:",americanToDecimal(result.homeOdds)];
    check(key,value);
}
console.log('length:',betmgmResult.length,'with betmgm:',output);

/***************************** DRAFTKINGS ********************************/
const draftkingsLinks = [
    'https://sportsbook.draftkings.com/leagues/basketball/nba',
    'https://sportsbook.draftkings.com/leagues/hockey/nhl',
    'https://sportsbook.draftkings.com/leagues/football/nfl',
    //'https://sportsbook.draftkings.com/leagues/mma/ufc',
];
const draftkingsResult = await draftkings(draftkingsLinks);
for (const result of draftkingsResult) {
    const key = getLastWord(result.away) + getLastWord(result.home) + draftDate(result.date);
    const value = ["DraftKings:",americanToDecimal(result.awayOdds),"DraftKings:",americanToDecimal(result.homeOdds)];
    check(key,value);
}
console.log('length:',draftkingsResult.length,'with draftkings:',output);




/***************************** ARBITRAGE BET CHECK ********************************/
const arbBets = new Map();

for (const [key, value] of output) {

    const awayOdds = value[1];
    const homeOdds = value[3];
    const homeRatio = (1/homeOdds).toFixed(4);
    const awayRatio = (1/awayOdds).toFixed(4);
    const probability = (1 / homeOdds + 1 / awayOdds).toFixed(4);
    
    if (probability < 1) {
        const arbValue = [value[0] + ' ' + awayOdds + ' Ratio: ' + awayRatio, value[2] + ' ' + homeOdds + ' Ratio: ' + homeRatio, "Probability", probability];
        arbBets.set(key, arbValue); 
    }
}

console.log('Arbitrage bets:', arbBets);

/****************************** FUNCTIONS ************************************/
function check(key,value){
    if (!output.has(key)) {
        output.set(key, value);
    } else {
        const existingValue = output.get(key);
        if (value[1] > existingValue[1] ) {
            existingValue[0] = value[0];
            existingValue[1] = value[1];
        }
        if (value[3] > existingValue[3]) {
            existingValue[2] = value[2];
            existingValue[3] = value[3];
        }
        output.set(key, existingValue);
    }
}
function getWordsAfterFirst(str) {
    const words = str.split(" ");
    return words.slice(1).join(" ");
}

function getWord(str, int) {
    const words = str.split(" ");
    return words[int];
}

function monthToNum(str){
    const months = { JAN: "1", FEB: "2", MAR: "3", APR: "4", MAY: "5", JUN: "6", JUL: "7", AUG: "8", SEP: "9", OCT: "10", NOV: "11", DEC: "12",
        January: "1", February: "2", March: "3", April: "4", May: "5", June: "6", July: "7", August: "8", September: "9", October: "10", November: "11", December: "12",
        Jan: "1", Feb: "2", Mar: "3", Apr: "4", May: "5", Jun: "6", Jul: "7", Aug: "8", Sep: "9", Oct: "10", Nov: "11", Dec: "12",
        '01': "1", '02': "2", '03': "3", '04': "4", '05': "5", '06': "6", '07': "7", '08': "8", '09': "9", '10': "10", '11': "11", '12': "12",
        '13': "13", '14': "14", '15': "15", '16': "16", '17': "17", '18': "18", '19': "19", '20': "20", '21': "21", '22': "22", '23': "23", '24': "24",
        '25': "25", '26': "26", '27': "27", '28': "28", '29': "29", '30': "30", '31': "31",
     };
    return months[str];
}

function removeLastTwo(str) {
    return str.slice(-2);
}

function polymarketOdds(str) {
    const cleaned = str.replace(/[$,%()]/g, "").split(" ")[0];
    return Number((parseFloat(cleaned) / 100).toFixed(2));
}

function getLastWord(str) {
    const words = str.split(" ");
    return words[words.length - 1];
}

function americanToDecimal(str) {
    if (str[0] == '+') {
        return 1 + (Number(str.slice(1)) / 100);
    } else {
        const neg = Number((1 + (100 / Number(str.slice(1)))).toFixed(2));
        return (neg > 1000) ? 0 : neg;
    }
}

function weekToDate(str) {
    const weekDays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const words = str.split(" ");
    if (words.length == 1) return monthSlashDay;
    const firstWord = words[0];
    const value = new Date(date);
    let change = 0;
    if (weekDays[firstWord] == undefined){
        return monthToNum(firstWord) + '/' + words[1];
    }
    if (weekDays[firstWord] == dayOfWeekIndex) {
    
    } else if (weekDays[firstWord] < dayOfWeekIndex) {
        change = weekDays[firstWord] - dayOfWeekIndex + 7;
        value.setDate(value.getDate() + change);
    } else {
        change = weekDays[firstWord] - dayOfWeekIndex;
        value.setDate(value.getDate() + change);
    }
    return (value.getMonth() + 1) + '/' + value.getDate();
}

function todayToDate(str) {
    if (str == 'Today' || str == 'Starting' || str == 'Q1'
        || str == 'Q2' || str == 'Q3' || str == 'Q4' || str == 'P1'
        || str == 'P2' || str == 'P3' || str == '1st' || str == '2nd'
        || str == '3rd' || str == '4th' || str == 'OT' || str == 'Halftime' || str == 'LIVE'
        || str == '2H' || str == '1H' || str == 'Intermission'
    ) {
        return monthSlashDay;
    } else if (str == 'Tomorrow') {
        return tomorrowMonthSlashDay;
    } else {
       return str;
    }
}

function utcToLocal(str){
    const local = new Date(str);
    return (local.getMonth() + 1) + '/' + local.getDate();
}

function draftDate(str) {
    const draft = todayToDate(str);
    if (draft == str){
        const draftDay = getWord(str,2);
        const draftMonth = monthToNum(getWord(str,1)) + '/';
        return (draftDay.length == 3) ? draftMonth + draftDay[0] : draftMonth + draftDay[0] + draftDay[1];
    } else {
        return draft;
    }
}



function mgmDate(str) {
    const mgm = todayToDate(str);
    
    if (mgm == str) {
        const split = mgm.split('/');
        return split[0] + '/' + split[1];
    } else {
        return mgm;
    }
}

function espnDate(str) {
    const words = str.split(' ');
    const first = words[0];
    const espn = todayToDate(first);
    if (espn == first) {
        return monthToNum(first) + '/' + words[1].slice(0,-1);
    } else {
        return espn;
    }
}

function even(str){
    if (str == 'Even'){
        return 2;
    } else {
        return americanToDecimal(str);
    }
}

function noRanking(str){
    if (str[0] == '('){
        return getWordsAfterFirst(str); 
    }
    return str;
}



