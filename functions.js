function getWordsAfterFirst(str) {
    const words = str.split(" ");
    return words.slice(1).join(" ");
}

function getWord(str, int) {
    const words = str.split(" ");
    return words[int];
}

function monthtoNum(str){
    const months = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };
    return months[str];
}

function removeLastTwo(str) {
    return str.slice(0, -2);
}

export function leagueLower(int) {
    const leagueLower = {0: "nba",1: "nhl",2: "nfl"};
    
}

export function sportLower(int) {
    const sportLower = {0:"basketball",1:"hockey",2:"football"};
}