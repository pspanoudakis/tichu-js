import { cardColors, normalCards, specialCards } from "./CardInfo";

const letterValues = {
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

export class BombInfo {
    constructor(upper, lower, color='') {
        this.upper = (letterValues[upper] !== undefined) ? letterValues[upper] : parseInt(upper);
        this.lower = (letterValues[lower] !== undefined) ? letterValues[lower] : parseInt(lower);
        let length = this.upper - this.lower + 1;
        this.length = (length > 1 ? length : 4);
        this.color = color;
    }

    static createBomb(cards) {
        if (cards.length > 4) {
            // Kenta bomb
            let previousCardValue = cards[0].value;
            const color = cards[0].color;
            for (let i = 1; i < cards.length; i++) {
                if (cards[i].value !== previousCardValue - 1 || cards[i].color !== color) {
                    return null;
                }
                previousCardValue--;
            }
            return new BombInfo(cards[0].name, cards[cards.length - 1].name, color);
        }
        else if (cards.length === 4) {
            // 4 same cards bomb
            const name = cards[0].name;
            if(cards.slice(1, 4).some(card => card.name !== name))
            {
                return null;
            }
            return new BombInfo(name, name);
        }
        else {
            // invalid
            return null;
        }
    }

    static compareBombs(a, b) {
        if (a === b) { return 0; }
        if (a === null) { return -1; }
        if (b === null) { return 1; }

        if (a.length !== b.length) {
            return a.length - b.length;
        }
        if (a.upper !== b.upper) {
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
            if(!Object.values(specialCards).includes(card.name)) {
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
                const [,colors] = cardGroupArray[i];
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
                    if (lengthCounter === 0) {
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
        if (strongestBomb === null) {
            for (let i = cardGroupArray.length - 1; i >= 0; i--) {
                const [name, colors] = cardGroupArray[i];
                if (!Object.values(colors).includes(false)) {
                    // we have a bomb
                    let bomb = new BombInfo(name, name);
                    // We iterate over the cards starting from the strongest,
                    // so we won't find a stronger bomb
                    strongestBomb = bomb;
                    break;
                }
            }
        }
        return strongestBomb;
    }
}
