import { cardImages } from "./CardResources";

/** Helper interface to easily find the value and the image path for each different card. */
interface SpecificCardInfo {
    /** The value of a specific normal card title. */
    value: number;
    /** A map with the image path for each color of this card title. */
    colorImgs: Map<string, string | undefined>;
}

/** Possible card colors. */
export const cardColors = {
    BLACK: 'black',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
}

// Storing color values here since they are widely used by the app.
export const cardColorValues = Object.values(cardColors);

/** Each letter card title is mapped to its value here. */
let letterValues: Map<string, number> = new Map();
letterValues.set('J', 11);
letterValues.set('Q', 12);
letterValues.set('K', 13);
letterValues.set('A', 14);

/** Initializes the {@link normalCards} object. */
function initializeNormalCards() {
    let _normalCards_: Map<string, SpecificCardInfo> = new Map();
    // Map all numeric card titles first
    for (let i = 2; i <= 10; i++) {
        // Map this title to its value
        let currentInfo: SpecificCardInfo = {
            value: i,
            colorImgs: new Map()
        };
        // Map each color of this card title to its image path
        for (const color of cardColorValues) {
            currentInfo.colorImgs.set(color, cardImages.get(color + '_' + i.toString()));
        }
        // Store
        _normalCards_.set(i.toString(), currentInfo);
    }
    /** Same for letter card titles, use values from {@link letterValues} */
    for (const [letter, value] of Array.from(letterValues.entries())) {
        let currentInfo: SpecificCardInfo = {
            value: value,
            colorImgs: new Map()
        };
        for (const color of cardColorValues) {
            currentInfo.colorImgs.set(color, cardImages.get(color + '_' + letter));
        }
        _normalCards_.set(letter, currentInfo);
    }
    return _normalCards_;
}

/** Maps normal card titles to {@link SpecificCardInfo} objects. */
const normalCards = initializeNormalCards();
export const normalCardKeys = Array.from(normalCards.keys());
export const reversedCardKeys = Array.from(normalCardKeys).reverse();

/** 
 * Returns the {@link SpecificCardInfo} object for this card title.
 * 
 * Raises a {@link UnknownCardNameError} if an object was not found for this title.
 */
export function getNormalCardInfo(cardName: string) {
    const info = normalCards.get(cardName);
    if (info === undefined) {
        throw new UnknownCardNameError(cardName);
    }
    return info;
}

/** Special card titles. */
export const specialCards = {
    DOGS: 'Dogs',
    PHOENIX: 'Phoenix',
    MAHJONG: 'Mahjong',
    DRAGON: 'Dragon'
};
export const specialCardNames = Object.values(specialCards);

/**
 * Represents a specific Card, along with its information.
 */
export class CardInfo {

    /** Game logic related information */

    /** The card 'title' (letter, number or special name). */
    name: string;
    /** The value of the card. */
    value: number;
    /** The value of the card (see {@link cardColors}) */
    color: string | '';

    /** UI related information */

    /** Indicated whether the card is currently selected or not. */
    isSelected: boolean;
    /** The unique key of the card */
    key: string;
    /** The card image path */
    cardImg: string | undefined;
    /** Alternative text to display if the image is not found */
    alt: string;

    constructor(name: string, color = '') {
        switch (name) {
            case specialCards.DOGS:
                this.cardImg = cardImages.get('dogs');
                this.alt = specialCards.DOGS;
                /** By the book, Dogs card has zero value, but this tweak
                 * simplifies the combination logic. */
                this.value = -2;
                break;
            case specialCards.PHOENIX:
                this.cardImg = cardImages.get('phoenix');
                this.alt = specialCards.PHOENIX;
                this.value = 0.5;
                break;
            case specialCards.MAHJONG:
                this.cardImg = cardImages.get('mahjong');
                this.alt = specialCards.MAHJONG;
                this.value = 1;
                break;
            case specialCards.DRAGON:
                this.cardImg = cardImages.get('dragon');
                this.alt = specialCards.DRAGON;
                this.value = 20;
                break;
            default:
                // normal card, color must have been given
                let cardNameInfo = normalCards.get(name);
                if (cardNameInfo !== undefined) {
                    this.cardImg = cardNameInfo.colorImgs.get(color);
                    this.alt = name + "_" + color;
                    this.value = cardNameInfo.value;
                }
                else {
                    throw new UnknownCardNameError(name);
                }
                break;
        }
        this.name = name;
        this.isSelected = false;
        this.key = this.alt;
        this.color = color;
    };

    /**
     * Compares the given cards (their values).
     * 
     * If one of the given cards is the Phoenix, its temp value will be evaluated.
     * 
     * @returns `0` if they are equal, `> 0` if a > b, else `< 0`.
     */
    static compareCards(a: CardInfo, b: CardInfo) {
        let valueA = a.value;
        let valueB = b.value;
        if (a instanceof PhoenixCard) {
            valueA = a.tempValue;
        }
        else if (b instanceof PhoenixCard) {
            valueB = b.tempValue;
        }
        return valueB - valueA;
    }
};

/**
 * Represents the Phoenix special card.
 * 
 * The Phoenix may be used as a replacement to a normal card, so it has
 * extra slots to store the information of the card it replaces.
 * It may not be used to replace a card with specific color.
 */
export class PhoenixCard extends CardInfo {
    tempValue: number;
    tempName: string;
    
    constructor() {
        super(specialCards.PHOENIX);
        this.tempName = '';
        this.tempValue = 0.5;
    }
}

/**
 * Signals that an unknown card name was found (if thrown, this is a bug).
 */
class UnknownCardNameError extends Error {
    constructor(unknownName: string) {
        super(`Unknown Card Name: ${unknownName}`);
    }
}
