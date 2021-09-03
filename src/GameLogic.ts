interface Card {
    name: string
    value: number
    color: string
    tempName: string
    tempValue: number
}

function isBetween(target: number, a: number, b: number) {
    return target >= a && target <= b;
}

function compareCards(a: Card, b: Card) {
    return b.value - a.value;
}

interface LetterValues {
    [letter: string]: number
}

interface CardsMap {
    [cardName: string]: number
}

interface CardColorMap {
    [color: string]: boolean
}

interface NormalCards {
    [cardName: number | string]: CardColorMap & {
        value: number
    };
};

declare let normalCards: NormalCards;
normalCards.value;
let specialCards = {
    DOGS: 'Dogs',
    PHOENIX: 'Phoenix',
    MAJONG: 'Majong',
    DRAGON: 'Dragon'
};

const letterValues: LetterValues = {
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

const cardCombinations = {
    KENTA: 'Kenta',
    FULLHOUSE: 'FullHouse',
    STEPS: 'Steps',
    TRIPLET: 'Triplet',
    COUPLE: 'Couple',
    SINGLE: 'Single'
}

abstract class CardCombination {
    value: number;
    combination: string;
    length: number;
    abstract compare(other: CardCombination | null): number;

    constructor(combination: string, len: number, val: number) {
        this.combination = combination;
        this.length = len;
        this.value = val;
    }
    static basicCompare(a: CardCombination | null, b: CardCombination | null) {
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
    static altCompare(a: CardCombination | null, b: CardCombination | null) {
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
    constructor(card: Card) {
        if (card.name !== specialCards.PHOENIX) {
            super(cardCombinations.SINGLE, 1, card.value);
        }
        else {
            super(cardCombinations.SINGLE, 1, card.tempValue);
        }          
    }
    static create(cards: Array<Card>) {
        if (cards.length !== 1) {
            return null;
        }
        return new SingleCard(cards[0]);
    }
    compare(other: SingleCard | null) {
        return CardCombination.basicCompare(this, other);
    }
}

class CardCouple extends CardCombination {
    constructor(cardValue: number) {
        super(cardCombinations.COUPLE, 2, cardValue);
    }
    static getStrongestRequested(cards: Array<Card>, requestedCard: string) {
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
    static create(cards: Array<Card>) {
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
    compare(other: CardCouple | null) {
        return CardCouple.compare(this, other)
    }
    static compare(a: CardCouple | null, b: CardCouple | null) {
        return CardCombination.basicCompare(a, b);
    }
}

class Triplet extends CardCombination {
    constructor(cardValue: number) {
        super(cardCombinations.TRIPLET, 3, cardValue);
    }
    static getStrongestRequested(cards: Array<Card>, requestedCard: string) {
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
    static create(cards: Array<Card>) {
        if (cards.length !== 3) {
            return null;
        }
        let normalCards = cards.filter(card => card.name !== specialCards.PHOENIX);
        if (normalCards.some(card => card.name !== normalCards[0].name))
        {
            return null;
        }
        return new Triplet(normalCards[0].value);
    }
    compare(other: Triplet | null) {
        return CardCombination.basicCompare(this, other);
    }
}

class Steps extends CardCombination {

    constructor(topValue: number, length: number) {
        super(cardCombinations.STEPS, length, topValue);
    }
    static getStrongestRequested(cards: Array<Card>, requested: string, length: number) {
        if (cards.length >= length) {
            const normalCardNames = Object.keys(normalCards);
            let cardOccurences: Map<string, number> = new Map();
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
                let requestedIndex = normalCardNames.indexOf(requested);
                let highIndex = Math.min(normalCardNames.length - 1, requestedIndex + length - 1);
                let lowIndex = highIndex - length + 1;
                while (lowIndex >= 0 && isBetween(requestedIndex, lowIndex, highIndex)) {
                    let phoenixUsedTemp = phoenixUsed;
                    let i = highIndex;
                    for (; i >= lowIndex; i--) {
                        const occurences = cardOccurences.get(normalCardNames[i]);
                        if (occurences !== undefined) {
                            if (occurences < 2) {
                                if (phoenixUsedTemp) { break; }
                                phoenixUsedTemp = true;
                            }
                        }
                        else { break; }
                    }
                    if (i < lowIndex) {
                        return new Steps(normalCards[normalCardNames[highIndex]].value, length);
                    }
                    highIndex--;
                    lowIndex--;
                }
            }
        }
        return null;
    }
    static create(cards: Array<Card>) {        
        if (cards.length >= 4 && cards.length % 2) {
            let cardOccurences: Map<number, number> = new Map();
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
    compare(other: Steps | null) {
        return CardCombination.altCompare(this, other);
    }
}

class Kenta extends CardCombination {
    constructor(topValue: number, length: number) {
        super(cardCombinations.KENTA, length, topValue);
    }
    static getStrongestRequested(cards: Array<Card>, requested: string, length: number) {
        if (cards.length >= length) {
            const normalCardNames = Object.keys(normalCards);
            let cardOccurences: Map<string, number> = new Map();
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
                (requestedOccurences >= 1 || !phoenixUsed) ) {
                let requestedIndex = normalCardNames.indexOf(requested);
                let highIndex = Math.min(normalCardNames.length - 1, requestedIndex + length - 1);
                let lowIndex = highIndex - length + 1;
                while (lowIndex >= 0 && isBetween(requestedIndex, lowIndex, highIndex)) {
                    let phoenixUsedTemp = phoenixUsed;
                    let i = highIndex;
                    for (; i >= lowIndex; i--) {
                        const occurences = cardOccurences.get(normalCardNames[i]);
                        if (occurences !== undefined) {
                            if (occurences < 1) {
                                if (phoenixUsedTemp) { break; }
                                phoenixUsedTemp = true;
                            }
                        }
                        else { break; }
                    }
                    if (i < lowIndex) {
                        return new Kenta(normalCards[normalCardNames[highIndex]].value, length);
                    }
                    highIndex--;
                    lowIndex--;
                }
            }
        }
        return null;
    }
    static create(cards: Array<Card>) {
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
    compare(other: Kenta | null) {
        return CardCombination.altCompare(this, other);
    }
}

class FullHouse extends CardCombination {
    constructor(cardA: string, timesA: number, cardB: string, timesB: number) {
        let value;
        if (timesA > timesB){
            value = (letterValues[cardA] !== undefined) ? letterValues[cardA] : parseInt(cardA);
        }
        else {
            value = (letterValues[cardB] !== undefined) ? letterValues[cardB] : parseInt(cardB);
        }
        super(cardCombinations.FULLHOUSE, 5, value);
    }
    static create(cards: Array<Card>) {
        if (cards.length === 5) {
            let cardOccurences: CardsMap = {};
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
    compare(other: FullHouse | null) {
        return CardCombination.basicCompare(this, other);
    }
    static getStrongestRequested(cards: Array<Card>, requestedCard: string) {
        let phoenixUsed = !cards.some(card => card.name === specialCards.PHOENIX);
        let nonRequestedRequired = 0;
        // Counts occurences of each card
        let cardOccurences: CardsMap = {};
        for (const cardName of Object.keys(normalCards).reverse()) {
            cardOccurences[cardName] = 0;
        }
        const specialCardNames = Object.values(specialCards)
        for (const card of cards) {
            if (!specialCardNames.includes(card.name)) {
                cardOccurences[card.name]++;
            }        
        }
        // map ready
    
        if (cardOccurences[requestedCard] < 1) {
            // cannot create a full house with the requested card
            return null;
        }
        if (cardOccurences[requestedCard] < 2) {
            if (!phoenixUsed) {
                // Using phoenix to replace a second requested card
                phoenixUsed = true;
                // Looking for the strongest card with 3 occurences now...
                nonRequestedRequired = 3;
            }
            else { return null; }
        }
        else {
            nonRequestedRequired = 5 - Math.min(cardOccurences[requestedCard], 3);
        }
        
        // Iterate over card names, starting from the strongest (skip the requested)
        for (const [card, occurences] of Object.entries(cardOccurences)) {
            if (card !== requestedCard) {
                if (occurences >= nonRequestedRequired || 
                   ((occurences === nonRequestedRequired - 1) && !phoenixUsed)) {
                    return new FullHouse(card, nonRequestedRequired, requestedCard, 5 - nonRequestedRequired);
                }
            }
        }
        return null;
    }
}

// --------------------------------------------------------------------------------------------------------------------

function containsPair(cards: Array<Card>, requestedCard: string, hasPhoenix: boolean) {
    let requestedPresentCards = cards.filter(card => card.name === requestedCard);
    if (requestedPresentCards.length < 1) {
        return false;
    }
    else if (requestedPresentCards.length < 2) {
        return hasPhoenix;
    }
    else {
        return true;
    }
}

function containsTriplet(cards: Array<Card>, requestedCard: string, hasPhoenix: boolean) {
    let requestedPresentCards = cards.filter(card => card.name === requestedCard);
    if (requestedPresentCards.length < 2) {
        return false;
    }
    else if (requestedPresentCards.length < 3) {
        return hasPhoenix;
    }
    else {
        return true;
    }
}

function getStrongestFullHouse(cards: Array<Card>, requestedCard: string, hasPhoenix: boolean) {
    let phoenixUsed = false;
    let nonRequestedRequired = 0;
    // Counts occurences of each card
    let cardOccurences: CardsMap = {};
    for (const cardName of Object.keys(normalCards).reverse()) {
        cardOccurences[cardName] = 0;
    }
    const specialCardNames = Object.values(specialCards)
    for (const card of cards) {
        if (!specialCardNames.includes(card.name)) {
            cardOccurences[card.name]++;
        }        
    }
    // map ready

    if (cardOccurences[requestedCard] < 1) {
        // cannot create a full house with the requested card
        return null;
    }
    if (cardOccurences[requestedCard] < 2) {
        if (hasPhoenix) {
            // Using phoenix to replace a second requested card
            phoenixUsed = true;
            // Looking for the strongest card with 3 occurences now...
            nonRequestedRequired = 3;
        }
        else { return null; }
    }
    else {
        nonRequestedRequired = 5 - Math.min(cardOccurences[requestedCard], 3);
    }
    
    // Iterate over card names, starting from the strongest (skip the requested)
    for (const [card, occurences] of Object.entries(cardOccurences)) {
        if (card !== requestedCard) {
            if (occurences >= nonRequestedRequired || 
               ((occurences === nonRequestedRequired - 1) && !phoenixUsed)) {
                return new FullHouse(card, nonRequestedRequired, requestedCard, 5 - nonRequestedRequired);
            }
        }
    }
    return null;
}
