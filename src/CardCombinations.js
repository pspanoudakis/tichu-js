import {
            cardColorValues,
            normalCardKeys,
            normalCards,
            specialCards,
            specialCardNames
        } from "./CardInfo";

function isBetween(target, a, b) {
    return target >= a && target <= b;
}

export const cardCombinations = {
    KENTA: 'Kenta',
    FULLHOUSE: 'FullHouse',
    STEPS: 'Steps',
    TRIPLET: 'Triplet',
    COUPLE: 'Couple',
    SINGLE: 'Single',
    BOMB: 'Bomb'
}

export class CardCombination {
    constructor(combination, len, val) {
        this.combination = combination;
        this.length = len;
        this.value = val;
    }
    static basicCompare(a, b) {
        if (a === b) {
            return 0;
        }
        if (a === null) {
            return -1;
        }
        if (b === null) {
            return 1;
        }
        return a.value - b.value;
    }
    static altCompare(a, b) {
        if (a === b) {
            return 0;
        }
        if (a === null) {
            return -1;
        }
        if (b === null) {
            return 1;
        }
        if (a.length !== b.length) {
            return 0;
        }
        return a.value - b.value;
    }
}

export class SingleCard extends CardCombination {
    constructor(card) {
        if (card.name !== specialCards.PHOENIX) {
            super(cardCombinations.SINGLE, 1, card.value);
        }
        else {
            super(cardCombinations.SINGLE, 1, card.tempValue);
        }          
    }
    static getStrongestRequested(cards, requested) {
        const target = cards.find(card => card.name === requested);
        return (target !== undefined) ? new SingleCard(target) : null;
    }
    static create(cards) {
        if (cards.length !== 1) {
            return null;
        }
        return new SingleCard(cards[0]);
    }
    compareCombination(other) {
        return CardCombination.basicCompare(this, other);
    }
    compare(cards, requested) {
        return CardCombination.basicCompare(this, SingleCard.getStrongestRequested(cards, requested));
    }
}

export class CardCouple extends CardCombination {
    constructor(cardValue) {
        super(cardCombinations.COUPLE, 2, cardValue);
    }
    static getStrongestRequested(cards, requestedCard) {
        let hasPhoenix = cards.some(card => card.name === specialCards.PHOENIX);
        let targetCards = cards.filter(card => card.name === requestedCard);
        if (targetCards.length >= 2 || 
            (targetCards.length === 1 && hasPhoenix)) {
                return new CardCouple(normalCards.get(requestedCard).value);
        }
        return null;
    }
    static create(cards) {
        if (cards.length !== 2) {
            return null;
        }
        if (cards[0].name !== cards[1].name)
        {
            const phoenixIndex = cards.findIndex(card => card.name === specialCards.PHOENIX);
            if (phoenixIndex !== -1) {
                const otherIndex = (phoenixIndex + 1) % 2;
                if ( !specialCardNames.includes(cards[otherIndex].name) ) {
                    return new CardCouple(cards[otherIndex].value);
                }                
            }
            return null;
        }
        return new CardCouple(cards[0].value);
    }
    compareCombination(other) {
        return CardCombination.basicCompare(this, other);
    }
    compare(cards, requested) {
        return CardCombination.basicCompare(this, CardCouple.getStrongestRequested(cards, requested));
    }
}

export class Triplet extends CardCombination {
    constructor(cardValue) {
        super(cardCombinations.TRIPLET, 3, cardValue);
    }
    static getStrongestRequested(cards, requestedCard) {
        let hasPhoenix = cards.some(card => card.name === specialCards.PHOENIX);
        let targetCards = cards.filter(card => card.name === requestedCard);
        if (targetCards.length >= 3 || 
            (targetCards.length === 2 && hasPhoenix)) {
                return new Triplet(normalCards.get(requestedCard).value);
        }
        return null;
    }
    static create(cards) {
        if (cards.length !== 3) {
            return null;
        }
        let filteredCards = cards.filter(card => card.name !== specialCards.PHOENIX);
        if (filteredCards.some(card => card.name !== filteredCards[0].name))
        {
            return null;
        }
        return new Triplet(filteredCards[0].value);
    }
    compareCombination(other) {
        return CardCombination.basicCompare(this, other);
    }
    compare(cards, requested) {
        return CardCombination.basicCompare(this, Triplet.getStrongestRequested(cards, requested));
    }
}

export class Steps extends CardCombination {

    constructor(topValue, length) {
        super(cardCombinations.STEPS, length, topValue);
    }
    static getStrongestRequested(cards, requested, length) {
        if (cards.length >= length) {
            let cardOccurences = new Map();
            let phoenixUsed = true;
            for (const card of cards) {
                if ( !specialCardNames.includes(card.name) ) {
                    let occurences = cardOccurences.get(card.name);
                    if (occurences === undefined) {
                        occurences = 0;
                    }
                    cardOccurences.set(card.name, occurences + 1);
                }
                else {
                    phoenixUsed = !(card.name === specialCards.PHOENIX);
                }
            }
            const requestedOccurences = cardOccurences.get(requested);
            if ( requestedOccurences !== undefined &&
                (requestedOccurences >= 2 || (requestedOccurences === 1 && !phoenixUsed)) ) {
                let requestedIndex = normalCardKeys.indexOf(requested);
                let highIndex = Math.min(normalCardKeys.length - 1, requestedIndex + length - 1);
                let lowIndex = highIndex - length + 1;
                while (lowIndex >= 0 && isBetween(requestedIndex, lowIndex, highIndex)) {
                    let phoenixUsedTemp = phoenixUsed;
                    let i = highIndex;
                    for (; i >= lowIndex; i--) {
                        const occurences = cardOccurences.get(normalCardKeys[i]);
                        if (occurences !== undefined) {
                            if (occurences < 2) {
                                if (phoenixUsedTemp) { break; }
                                phoenixUsedTemp = true;
                            }
                        }
                        else { break; }
                    }
                    if (i < lowIndex) {
                        return new Steps(normalCards.get(normalCardKeys[highIndex]).value, length);
                    }
                    highIndex = i - 1;
                    lowIndex = highIndex - length + 1;
                }
            }
        }
        return null;
    }
    static create(cards) {        
        if (cards.length >= 4 && cards.length % 2 === 0) {
            let cardOccurences = new Map();
            let phoenixUsed = true;
            for (const card of cards) {
                if (specialCardNames.includes(card.name)) {
                    if (card.name !== specialCards.PHOENIX) {
                        return null;
                    }
                    phoenixUsed = false;
                }
                else {
                    let occurences = cardOccurences.get(card.value);
                    if (occurences === undefined) {
                        occurences = 0;
                    }
                    cardOccurences.set(card.value, occurences + 1);
                }
            }
            const cardOccurencesArray = Array.from(cardOccurences)
            if (cardOccurencesArray.length > 1) {
                let previousValue = cardOccurencesArray[0][0] + 1;
                for (const [cardValue, occurences] of cardOccurencesArray) {
                    if (occurences !== 2) {
                        if (occurences !== 1 || phoenixUsed) {
                            return null;                        
                        }
                        phoenixUsed = true;
                    }
                    if (previousValue !== cardValue + 1) {
                        return null;
                    }
                    previousValue = cardValue;
                }
                return new Steps(cardOccurencesArray[0][0], cardOccurencesArray.length);
            }            
        }
        return null;
    }
    compareCombination(other) {
        return CardCombination.altCompare(this, other);
    }
    compare(cards, requested, length) {
        return CardCombination.altCompare(this, Steps.getStrongestRequested(cards, requested, length));
    }
}

export class Kenta extends CardCombination {
    constructor(topValue, length) {
        super(cardCombinations.KENTA, length, topValue);
    }
    static getStrongestRequested(cards, requested, length) {
        if (cards.length >= length) {
            let cardOccurences = new Map();
            let phoenixUsed = true;
            for (const card of cards) {
                if ( !specialCardNames.includes(card.name) ) {
                    let occurences = cardOccurences.get(card.name);
                    if (occurences === undefined) {
                        occurences = 0;
                    }
                    cardOccurences.set(card.name, occurences + 1);
                }
                else {
                    phoenixUsed = !(card.name === specialCards.PHOENIX);
                }
            }
            if ( cardOccurences.get(requested) !== undefined || !phoenixUsed) {
                let requestedIndex = normalCardKeys.indexOf(requested);
                let highIndex = Math.min(normalCardKeys.length - 1, requestedIndex + length - 1);
                let lowIndex = highIndex - length + 1;
                while (lowIndex >= 0 && isBetween(requestedIndex, lowIndex, highIndex)) {
                    let phoenixUsedTemp = phoenixUsed;
                    let i = highIndex;
                    for (; i >= lowIndex; i--) {
                        const occurences = cardOccurences.get(normalCardKeys[i]);
                        if (occurences === undefined) {
                            if (phoenixUsedTemp) { break; }
                            phoenixUsedTemp = true;
                        }
                    }
                    if (i < lowIndex) {
                        return new Kenta(normalCards.get(normalCardKeys[highIndex]).value, length);
                    }
                    highIndex = i - 1;
                    lowIndex = highIndex - length + 1;
                }
            }
        }
        return null;
    }
    static create(cards) {
        if (cards.length > 4) {
            let phoenix = cards.find(card => card.name === specialCards.PHOENIX);
            let topValue = cards[0].value;
            if (phoenix !== undefined) {
                topValue = Math.max(phoenix.tempValue, topValue);
            }
            let expectedValue = topValue + 1;
            for (const card of cards) {
                expectedValue--;
                if (card.value !== expectedValue && card !== phoenix) {
                    if (phoenix === undefined || phoenix.tempValue !== expectedValue
                        || card.value !== phoenix.tempValue - 1) {

                        return null;
                    }
                    expectedValue = card.value;
                }
            }
            return new Kenta(topValue, cards.length);
        }
        return null;
    }
    compareCombination(other) {
        return CardCombination.altCompare(this, other);
    }
    compare(cards, requested, length) {
        return CardCombination.altCompare(this, Kenta.getStrongestRequested(cards, requested, length));
    }
}

export class FullHouse extends CardCombination {
    constructor(cardA, timesA, cardB, timesB) {
        let value;
        if (timesA > timesB){
            value = normalCards.get(cardA).value;
        }
        else {
            value = normalCards.get(cardB).value;
        }
        super(cardCombinations.FULLHOUSE, 5, value);
    }
    static create(cards) {
        if (cards.length === 5) {
            let cardOccurences = {};
            for (const card of cards) {
                if (card.name === specialCards.PHOENIX) {
                    if (card.tempName === "") {
                        return null;
                    }
                    if (cardOccurences[card.tempName] === undefined) {
                        cardOccurences[card.tempName] = 0;
                    }
                    cardOccurences[card.tempName]++;
                }
                else if (cardOccurences[card.name] === undefined) {
                    cardOccurences[card.name] = 1;
                }
                else {
                    cardOccurences[card.name]++;
                }
            }
            const distinctCards = Object.keys(cardOccurences);
            if (distinctCards.length === 2) {
                if (cardOccurences[distinctCards[0]] === 3) {
                    return new FullHouse(distinctCards[0], 3, distinctCards[1], 2);
                }
                return new FullHouse(distinctCards[1], 3, distinctCards[0], 2);
            }
        }
        return null;
    }
    compareCombination(other) {
        return CardCombination.basicCompare(this, other);
    }
    compare(cards, requested) {
        return CardCombination.basicCompare(this, FullHouse.getStrongestRequested(cards, requested));
    }
    static getStrongestRequested(cards, requestedCard) {
        if (cards.length >= 5) {
            let phoenixUsed = true;
            let requestedOccurences = 0;
            // Counts occurences of each card
            let cardOccurences = new Map();
            for (const card of cards) {
                if ( !specialCardNames.includes(card.name) ) {
                    let occurences = cardOccurences.get(card.name);
                    if (occurences === undefined) {
                        occurences = 0;
                    }
                    cardOccurences.set(card.name, ++occurences);
                    if (card.name === requestedCard) {
                        requestedOccurences = occurences;
                    }
                }
                else {
                    phoenixUsed = !(card.name === specialCards.PHOENIX);
                }
            }
            if (requestedOccurences < 1) { return null; }
            if (requestedOccurences < 2) {
                if (!phoenixUsed) {
                    // Using phoenix to replace a second requested card
                    phoenixUsed = true;
                    // Looking for the strongest card with 3 occurences now...
                    requestedOccurences = 2;
                }
                else { return null; }
            }
            else {
                requestedOccurences = Math.min(requestedOccurences, 3);
            }
            return FullHouse.strongestRequestedFullHouse(
                cardOccurences, requestedCard, requestedOccurences, phoenixUsed
            );
        }
        return null;
    }

    static strongestRequestedFullHouse(cardOccurences, requestedCard, requestedOccurences, phoenixUsed) {
        const requestedValue = normalCards.get(requestedCard).value;
        if (requestedOccurences === 3) {
            let eligible = undefined;
            for (const [cardName, occurences] of Array.from(cardOccurences)) {
                if (cardName !== requestedCard) {
                    const value = normalCards.get(cardName).value;
                    if (occurences >= 3 || (occurences === 2 && !phoenixUsed)) {
                        if (value > requestedValue) {
                            return new FullHouse(cardName, 3, requestedCard, 2);
                        }
                    }
                    else if ( occurences === 2 || !phoenixUsed ) {
                        eligible = cardName;
                    }
                }
            }
            if (eligible !== undefined) {
                return new FullHouse(eligible, 2, requestedCard, 3);
            }
        }
        else {
            for (const [cardName, occurences] of Array.from(cardOccurences)) {
                if (cardName !== requestedCard) {
                    if ((occurences >= 3) || (occurences === 2 && !phoenixUsed)) {
                        const value = normalCards.get(cardName).value;
                        if (value < requestedValue && !phoenixUsed) {
                            return new FullHouse(cardName, 2, requestedCard, 3);
                        }
                        return new FullHouse(cardName, 3, requestedCard, 2);
                    }
                }
            }
        }
        return null;
    }
}

export class Bomb extends CardCombination{
    constructor(upperCard, lowerCard, color='') {
        const topValue = normalCards.get(upperCard).value;
        const lower = normalCards.get(lowerCard).value;
        const length = topValue - lower + 1;
        super(cardCombinations.BOMB, length > 1 ? length : 4, topValue);
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
            return new Bomb(cards[0].name, cards[cards.length - 1].name, color);
        }
        else if (cards.length === 4) {
            // 4 same cards bomb
            const name = cards[0].name;
            if(cards.slice(1, 4).some(card => card.name !== name))
            {
                return null;
            }
            return new Bomb(name, name);
        }
        else {
            // invalid
            return null;
        }
    }

    compare(other) {
        return Bomb.compareBombs(this, other);
    }

    static compareBombs(a, b) {
        if (a === b) { return 0; }
        if (a === null) { return -1; }
        if (b === null) { return 1; }

        if (a.length !== b.length) {
            return a.length - b.length;
        }
        return a.value - b.value;
    }

    static getStrongestRequested(cards, requested) {
        let strongestBomb = null;

        let normalCardsColorMap = {};
        for (const key of normalCardKeys) {
            normalCardsColorMap[key] = {};
            for (const color of cardColorValues) {
                normalCardsColorMap[key][color] = false;
            }
        }
        for (const card of cards) {
            if(!specialCardNames.includes(card.name)) {
                normalCardsColorMap[card.name][card.color] = true;
            }
        }
        const cardColorsArray = Object.entries(normalCardsColorMap);
        const targetIndex = cardColorsArray.findIndex(([name]) => name === requested);
        const [, targetColorMap] = cardColorsArray[targetIndex];
        for (const color of cardColorValues) {
            if (targetColorMap[color] === true) {
                let upperIndex, lowerIndex;
                let lengthCounter = 0;
                let colorStrongest = null;
                
                for (let i = 0; i < cardColorsArray.length; i++) {
                    const [,colors] = cardColorsArray[i];
                    if (colors[color] === false) {
                        if (lengthCounter >= 5) {
                            if (targetIndex >= lowerIndex && targetIndex <= upperIndex) {
                                const [upperName] = cardColorsArray[upperIndex];
                                const [lowerName] = cardColorsArray[lowerIndex];
                                let bomb = new Bomb(upperName, lowerName, color);
                                if (Bomb.compareBombs(colorStrongest, bomb) < 0) {
                                    colorStrongest = bomb;
                                }
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
                    if (targetIndex >= lowerIndex && targetIndex <= upperIndex) {
                        const [upperName] = cardColorsArray[upperIndex];
                        const [lowerName] = cardColorsArray[lowerIndex];
                        let bomb = new Bomb(upperName, lowerName, color);
                        if (Bomb.compareBombs(colorStrongest, bomb) < 0) {
                            colorStrongest = bomb;
                        }
                    }
                }
                if (Bomb.compareBombs(strongestBomb, colorStrongest) < 0) {
                    strongestBomb = colorStrongest;
                }
            }
        }
        if (strongestBomb === null) {
            const [, targetColors] = cardColorsArray[targetIndex];
            if (Object.values(targetColors).every(hasColor => hasColor === true)) {
                strongestBomb = new Bomb(requested, requested);
            }
        }
        return strongestBomb;
    }

    static getStrongestBomb(cards) {
        let strongestBomb = null;

        let groupedNormalCards = {};
        for (const key of normalCardKeys) {
            groupedNormalCards[key] = {};
            for (const color of cardColorValues) {
                groupedNormalCards[key][color] = false;
            }
        }
        for (const card of cards) {
            if(!specialCardNames.includes(card.name)) {
                // not a special card
                groupedNormalCards[card.name][card.color] = true;
            }
        }
        const cardGroupArray = Object.entries(groupedNormalCards);

        for (const color of cardColorValues) {
            let upperIndex, lowerIndex;
            let lengthCounter = 0;
            let colorStrongest = null;
            for (let i = 0; i < cardGroupArray.length; i++) {
                const [,colors] = cardGroupArray[i];
                if (colors[color] === false) {
                    if (lengthCounter >= 5) {
                        const [upperName] = cardGroupArray[upperIndex];
                        const [lowerName] = cardGroupArray[lowerIndex];
                        let bomb = new Bomb(upperName, lowerName, color);
                        if (Bomb.compareBombs(colorStrongest, bomb) < 0) {
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
                let bomb = new Bomb(upperName, lowerName, color);
                if (Bomb.compareBombs(colorStrongest, bomb) < 0) {
                    colorStrongest = bomb;
                }
            }
            if (Bomb.compareBombs(strongestBomb, colorStrongest) < 0) {
                strongestBomb = colorStrongest;
            }
        }
        if (strongestBomb === null) {
            for (let i = cardGroupArray.length - 1; i >= 0; i--) {
                const [name, colors] = cardGroupArray[i];
                if (!Object.values(colors).includes(false)) {
                    // we have a bomb
                    let bomb = new Bomb(name, name);
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
