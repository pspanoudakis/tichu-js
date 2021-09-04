import { normalCardKeys, normalCards } from "./CardInfo";

function isBetween(target, a, b) {
    return target >= a && target <= b;
}

export const cardCombinations = {
    KENTA: 'Kenta',
    FULLHOUSE: 'FullHouse',
    STEPS: 'Steps',
    TRIPLET: 'Triplet',
    COUPLE: 'Couple',
    SINGLE: 'Single'
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
            return 1;
        }
        if (b === null) {
            return -1;
        }
        return a.value - b.value;
    }
    static altCompare(a, b) {
        if (a === b) {
            return 0;
        }
        if (a === null) {
            return 1;
        }
        if (b === null) {
            return -1;
        }
        if (a.length !== b.length) {
            return 0;
        }
        return a.value - b.value;
    }
}

class SingleCard extends CardCombination {
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
    compare(other) {
        return CardCombination.basicCompare(this, other);
    }
}

class CardCouple extends CardCombination {
    constructor(cardValue) {
        super(cardCombinations.COUPLE, 2, cardValue);
    }
    static getStrongestRequested(cards, requestedCard) {
        let hasPhoenix = cards.some(card => card.name === specialCards.PHOENIX);
        let targetCards = cards.filter(card => card.name === requestedCard);
        if (targetCards.length >= 2 || 
            (targetCards.length === 1 && hasPhoenix)) {
                const value = (letterValues[requestedCard] !== undefined)
                              ? letterValues[requestedCard]
                              : parseInt(requestedCard);
                return new CardCouple(value);
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
                if ( !Object.values(specialCards).includes(cards[otherIndex].name) ) {
                    return new CardCouple(cards[otherIndex].value);
                }                
            }
            return null;
        }
        return new CardCouple(cards[0].value);
    }
    compare(other) {
        return CardCouple.compare(this, other)
    }
    static compare(a, b) {
        return CardCombination.basicCompare(a, b);
    }
}

class Triplet extends CardCombination {
    constructor(cardValue) {
        super(cardCombinations.TRIPLET, 3, cardValue);
    }
    static getStrongestRequested(cards, requestedCard) {
        let hasPhoenix = cards.some(card => card.name === specialCards.PHOENIX);
        let targetCards = cards.filter(card => card.name === requestedCard);
        if (targetCards.length >= 3 || 
            (targetCards.length === 2 && hasPhoenix)) {
                const value = (letterValues[requestedCard] !== undefined)
                              ? letterValues[requestedCard]
                              : parseInt(requestedCard);
                return new Triplet(value);
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
    compare(other) {
        return CardCombination.basicCompare(this, other);
    }
}

class Steps extends CardCombination {

    constructor(topValue, length) {
        super(cardCombinations.STEPS, length, topValue);
    }
    static getStrongestRequested(cards, requested, length) {
        if (cards.length >= length) {
            let cardOccurences = new Map();
            let phoenixUsed = true;
            const specialCardNames = Object.values(specialCards)
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
        if (cards.length >= 4 && cards.length % 2) {
            let cardOccurences = new Map();
            let phoenixUsed = true;
            const specialCardNames = Object.values(specialCards)
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
    compare(other) {
        return CardCombination.altCompare(this, other);
    }
}

class Kenta extends CardCombination {
    constructor(topValue, length) {
        super(cardCombinations.KENTA, length, topValue);
    }
    static getStrongestRequested(cards, requested, length) {
        if (cards.length >= length) {
            let cardOccurences = new Map();
            let phoenixUsed = true;
            const specialCardNames = Object.values(specialCards)
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
    compare(other) {
        return CardCombination.altCompare(this, other);
    }
}

class FullHouse extends CardCombination {
    constructor(cardA, timesA, cardB, timesB) {
        let value;
        if (timesA > timesB){
            value = (letterValues[cardA] !== undefined) ? letterValues[cardA] : parseInt(cardA);
        }
        else {
            value = (letterValues[cardB] !== undefined) ? letterValues[cardB] : parseInt(cardB);
        }
        super(cardCombinations.FULLHOUSE, 5, value);
    }
    static create(cards) {
        if (cards.length === 5) {
            let cardOccurences = {};
            let hasPhoenix = false;
            for (const card of cards) {
                if (card.name === specialCards.PHOENIX) {
                    hasPhoenix = true;
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
            const distinctCards = Object.entries(cardOccurences);
            if ( distinctCards.length === 2 || (distinctCards.length === 3 && hasPhoenix) ) {
                let temp = ['', '', ''];
                for (const [cardName, times] of distinctCards) {
                    temp[times - 1] = cardName;
                }
                return new FullHouse(temp[2], 3, temp[1], 2);
            }
        }
        return null;
    }
    compare(other) {
        return CardCombination.basicCompare(this, other);
    }
    static getStrongestRequested(cards, requestedCard) {
        if (cards.length >= 5) {
            let phoenixUsed = true;
            let nonRequestedRequired = 0;
            let requestedOccurences = 0;
            // Counts occurences of each card
            let cardOccurences = new Map();
            const specialCardNames = Object.values(specialCards)
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
                    nonRequestedRequired = 3;
                    requestedOccurences = 2;
                }
                else { return null; }
            }
            else {
                requestedOccurences = Math.min(requestedOccurences, 3);
                nonRequestedRequired = 5 - requestedOccurences;
            }
            return strongestRequestedFullHouse(
                cardOccurences, requestedCard, requestedOccurences, phoenixUsed
            );
        }
        return null;
    }
}

function strongestRequestedFullHouse(cardOccurences, requestedCard, requestedOccurences, phoenixUsed) {
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