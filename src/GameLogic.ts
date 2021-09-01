interface Card {
    name: string
    value: number
    color: string
    tempName: string
    tempValue: number
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

type NormalCards = {
    [cardName in number | string]: CardColorMap;
};

let normalCards: NormalCards = {};
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
    abstract compare(other: CardCombination | null): number;

    constructor(combination: string) {
        this.combination = combination;
        this.value = -1;
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
}

class SingleCard extends CardCombination {
    constructor(card: Card) {
        super(cardCombinations.SINGLE);
        if (card.name !== specialCards.PHOENIX) {
            this.value = card.value;
        }
        else {
            this.value = card.tempValue;
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
    constructor(cardName: string) {
        super(cardCombinations.COUPLE)
        this.value = (letterValues[cardName] !== undefined) ? letterValues[cardName] : parseInt(cardName);
    }
    static getStrongestRequested(cards: Array<Card>, requestedCard: string, hasPhoenix: boolean) {
        let targetCards = cards.filter(card => card.name === requestedCard);
        if (targetCards.length >= 2 || 
            (targetCards.length === 1 && hasPhoenix)) {
                return new CardCouple(requestedCard);
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
                    return new CardCouple(cards[otherIndex].name);
                }                
            }
            return null;
        }
        return new CardCouple(cards[0].name);
    }
    compare(other: CardCouple | null) {
        return CardCouple.compare(this, other)
    }
    static compare(a: CardCouple | null, b: CardCouple | null) {
        return CardCombination.basicCompare(a, b);
    }
}

class Triplet extends CardCombination {
    constructor(cardName: string) {
        super(cardCombinations.TRIPLET)
        this.value = (letterValues[cardName] !== undefined) ? letterValues[cardName] : parseInt(cardName);
    }
    static getStrongestRequested(cards: Array<Card>, requestedCard: string, hasPhoenix: boolean) {
        let targetCards = cards.filter(card => card.name === requestedCard);
        if (targetCards.length >= 3 || 
            (targetCards.length === 2 && hasPhoenix)) {
                return new Triplet(requestedCard);
        }
        return null;
    }
    static create(cards: Array<Card>) {
        if (cards.length !== 3) {
            return null;
        }
        let normalCards = cards.filter(card => card.name !== specialCards.PHOENIX);
        let targetName = normalCards[0].name;
        if (normalCards.some(card => card.name !== targetName))
        {
            return null;
        }
        return new Triplet(targetName);
    }
    compare(other: Triplet | null) {
        return CardCombination.basicCompare(this, other);
    }
}

class Steps extends CardCombination {
    length: number;

    constructor(topCard: string, length: number) {
        super(cardCombinations.STEPS);
        this.value = (letterValues[topCard] !== undefined) ? letterValues[topCard] : parseInt(topCard);
        this.length = length;
    }
    static getStrongestRequested(cards: Array<Card>, requested: string, length: number, hasPhoenix: boolean) {

    }
    static create(cards: Array<Card>) {
        return null;
    }
    compare(other: Steps | null) {
        return Steps.compare(this, other);
    }
    static compare(a: Steps | null, b: Steps | null) {
        return 1;
    }
}

class Kenta extends CardCombination {
    length: number;

    constructor(topCard: string, length: number) {
        super(cardCombinations.KENTA);
        this.value = (letterValues[topCard] !== undefined) ? letterValues[topCard] : parseInt(topCard);
        this.length = length;
    }
    static getStrongestRequested(cards: Array<Card>, requested: string, length: number, hasPhoenix: boolean) {

    }
    static create(cards: Array<Card>) {
        if (cards.length > 4) {
            let previousCardValue = cards[0].value;
            const color = cards[0].color;
            for (let i = 1; i < cards.length; i++) {
                if (cards[i].value !== previousCardValue - 1) {
                    return null;
                }
                previousCardValue--;
            }
            return new Kenta(cards[0].name, cards.length);
        }
        return null;
    }
    compare(other: Kenta | null) {
        return Kenta.compare(this, other);
    }
    static compare(a: Kenta | null, b: Kenta | null) {
        return 1;
    }
}

class FullHouse extends CardCombination {
    constructor(cardA: string, timesA: number, cardB: string, timesB: number) {
        super(cardCombinations.FULLHOUSE);
        if (timesA > timesB) {
            this.value = (letterValues[cardA] !== undefined) ? letterValues[cardA] : parseInt(cardA);
        }
        else {
            this.value = (letterValues[cardB] !== undefined) ? letterValues[cardB] : parseInt(cardB);
        }
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
    static getStrongestRequested(cards: Array<Card>, requestedCard: string, hasPhoenix: boolean) {
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
}

// --------------------------------------------------------------------------------------------------------------------

function getStrongestSteps(cards: Array<Card>, requestedCard: string, length: number, hasPhoenix: boolean) {

}

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
