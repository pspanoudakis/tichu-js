import { cardColors, CardInfo, normalCards, specialCards } from "./CardInfo";

const letterValues = {
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

class BombInfo {
    constructor(upper, lower, color='') {
        this.upper = (letterValues[upper] != undefined) ? letterValues[upper] : upper;
        this.lower = (letterValues[lower] != undefined) ? letterValues[lower] : lower;
        this.length = upper - lower;
        this.color = color;
    }

    static compareBombs(a, b) {
        if (a === b) { return 0; }
        if (a === null) { return -1; }
        if (b === null) { return 1; }

        if (a.length != b.length) {
            return a.length - b.length;
        }
        if (a.upper != b.upper) {
            return a.upper - b.upper;
        }
        return 0;
    }

    static getStrongestBomb(cards) {
        let groupedNormalCards = {};
        let strongestBomb = null;

        for (const [key] of Object.entries(normalCards)) {
            groupedNormalCards[key] = {};
            for (const color of Object.entries(cardColors)) {
                groupedNormalCards[key][color] = false;
            }
        }

        for (const card of cards) {
            if(!Object.entries(specialCards).includes(card.name)) {
                // not a special card
                groupedNormalCards[card.name][card.color] = true;
            }
        }

        for (const color of Object.entries(cardColors)) {
            let upperIndex = -1;
            let lowerIndex = -1;
            let lengthCounter = 0;
            let colorStrongest = null;
            const cardGroupArray = Object.entries(groupedNormalCards);
            for (let i = 0; i < cardGroupArray.length; i++) {
                const [name, colors] = cardGroupArray[i];
                if (colors[color] === false) {
                    if (lengthCounter >= 5) {
                        const [upperName] = cardGroupArray[upperIndex];
                        const [lowerName] = cardGroupArray[lowerIndex];
                        let bomb = new BombInfo(upperName, lowerName, color);
                        if (BombInfo.compareBombs(colorStrongest, bomb) < 0) {
                            colorStrongest = bomb;
                        }
                    }
                    upperIndex = -1;
                    lowerIndex = -1;
                    lengthCounter = 0;
                }
                else {
                    if (lengthCounter > 0) {
                        upperIndex = i;
                        lengthCounter++;
                    }
                    else {
                        upperIndex = i;
                        lowerIndex = i;
                        lengthCounter = 1;
                    }
                }
            }
            if (BombInfo.compareBombs(strongestBomb, colorStrongest) < 0) {
                strongestBomb = colorStrongest;
            }
        }
        return strongestBomb;
    }
};
