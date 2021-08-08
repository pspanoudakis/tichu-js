import { cardColors, normalCards, specialCards } from "./CardInfo";

const letterValues = {
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

export class BombInfo {
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
        let strongestBomb = null;

        let groupedNormalCards = {};
        for (const key of Object.keys(normalCards)) {
            groupedNormalCards[key] = {};
            for (const color of Object.values(cardColors)) {
                groupedNormalCards[key][color] = false;
            }
        }
        for (const card of cards) {
            if(!Object.entries(specialCards).includes(card.name)) {
                // not a special card
                groupedNormalCards[card.name][card.color] = true;
            }
        }
        const cardGroupArray = Object.entries(groupedNormalCards);

        for (const color of Object.values(cardColors)) {
            let upperIndex, lowerIndex;
            let lengthCounter = 0;
            let colorStrongest = null;
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
                    lengthCounter = 0;
                }
                else {
                    if (lengthCounter == 0) {
                        lowerIndex = i;
                    }
                    upperIndex = i;
                    lengthCounter++;
                }
            }
            if (lengthCounter >= 5) {
                const [upperName] = cardGroupArray[upperIndex];
                const [lowerName] = cardGroupArray[lowerIndex];
                let bomb = new BombInfo(upperName, lowerName, color);
                if (BombInfo.compareBombs(colorStrongest, bomb) < 0) {
                    colorStrongest = bomb;
                }
            }
            if (BombInfo.compareBombs(strongestBomb, colorStrongest) < 0) {
                strongestBomb = colorStrongest;
            }
        }
        if (strongestBomb != null) {
            // What about 4 same cards?
            for (let i = cardGroupArray.length - 1; i >= 0; i--) {
                const [name, colors] = cardGroupArray[i];
                if (!Object.values(colors).includes(false)) {
                    // we have a bomb
                    let bomb = new BombInfo()
                    // We iterate over the cards starting from the strongest,
                    // so we won't find a stronger bomb
                    break;
                }
            }
        }        
        return strongestBomb;
    }
};
