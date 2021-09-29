import { cardImages } from "./CardResources";

export const cardColors = {
    BLACK: 'black',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
}

export const cardColorValues = Object.values(cardColors);

let letterValues: Map<string, number> = new Map();
letterValues.set('J', 11);
letterValues.set('Q', 12);
letterValues.set('K', 13);
letterValues.set('A', 14);

interface SpecificCardInfo {
    value: number;
    colorImgs: Map<string, string | undefined>;
}

function initializeNormalCards() {
    let normalCards: Map<string, SpecificCardInfo> = new Map();
    for (let i = 2; i <= 10; i++) {
        let currentInfo: SpecificCardInfo = {
            value: i,
            colorImgs: new Map()
        };
        for (const color of cardColorValues) {
            currentInfo.colorImgs.set(color, cardImages.get(color + '_' + i.toString()));
        }
        normalCards.set(i.toString(), currentInfo);
    }
    for (const [letter, value] of Array.from(letterValues.entries())) {
        let currentInfo: SpecificCardInfo = {
            value: value,
            colorImgs: new Map()
        };
        for (const color of cardColorValues) {
            currentInfo.colorImgs.set(color, cardImages.get(color + '_' + letter));
        }
        normalCards.set(letter, currentInfo);
    }
    return normalCards;
}

export const normalCards = initializeNormalCards();
export const normalCardKeys = Array.from(normalCards.keys());
export const reversedCardKeys = Array.from(normalCardKeys).reverse();

export const specialCards = {
    DOGS: 'Dogs',
    PHOENIX: 'Phoenix',
    MAJONG: 'Majong',
    DRAGON: 'Dragon'
};

export const specialCardNames = Object.values(specialCards);

export class CardInfo {

    name: string;
    value: number;
    isSelected: boolean;
    color: string | '';
    key: string;
    cardImg: string | undefined;
    alt: string;
    tempName: string;
    tempValue: number;

    constructor(name: string, color = '') {
        this.tempValue = 0;
        switch (name) {
            case specialCards.DOGS:
                this.cardImg = cardImages.get(specialCards.DOGS);
                this.alt = specialCards.DOGS;
                this.value = 0;
                break;
            case specialCards.PHOENIX:
                this.cardImg = cardImages.get(specialCards.PHOENIX);
                this.alt = specialCards.PHOENIX;
                this.value = 0.5;
                this.tempValue = 0.5;
                break;
            case specialCards.MAJONG:
                this.cardImg = cardImages.get(specialCards.MAJONG);
                this.alt = specialCards.MAJONG;
                this.value = 1;
                break;
            case specialCards.DRAGON:
                this.cardImg = cardImages.get(specialCards.DRAGON);
                this.alt = specialCards.DRAGON;
                this.value = 20;
                break;
            default:
                // normal card, color is not null
                let cardNameInfo = normalCards.get(name);
                if (cardNameInfo !== undefined) {
                    this.cardImg = cardNameInfo.colorImgs.get(color);
                    this.alt = name + "_" + color;
                    this.value = cardNameInfo.value;
                }
                else {
                    throw new Error('Unexpected card name');
                }
                break;
        }
        this.name = name;
        this.tempName = '';
        this.isSelected = false;
        this.key = this.alt;
        this.color = color;
    };

    static compareCards(a: CardInfo, b: CardInfo) {
        return b.value - a.value;
    }
};
