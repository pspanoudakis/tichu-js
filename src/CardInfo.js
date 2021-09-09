import {cardImages} from "./CardResources";

export const cardColors = {
    BLACK: 'black',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
}

export const cardColorValues = Object.values(cardColors);

let _letterValues_ = new Map();
_letterValues_.set('J', 11);
_letterValues_.set('Q', 12);
_letterValues_.set('K', 13);
_letterValues_.set('A', 14);

export const letterValues = {
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

let _normalCards_ = new Map();
(function initializeNormalCards() {
    for (let i = 2; i <= 10; i++) {
        let currentInfo = {};
        for (const color of cardColorValues) {
            currentInfo[color] = cardImages[color + '_' + i.toString()];
            currentInfo['value'] = i;
        }
        _normalCards_.set(i.toString(), currentInfo);
    }
    for (const [letter, value] of _letterValues_.entries()) {
        let currentInfo = {};
        for (const color of cardColorValues) {
            currentInfo[color] = cardImages[color + '_' + letter];
            currentInfo['value'] = value;
        }
        _normalCards_.set(letter, currentInfo);
    }
})();

export const normalCards = _normalCards_;
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
    constructor(name, color = '') {
        switch (name) {
            case specialCards.DOGS:
                this.cardImg = cardImages.dogs;
                this.alt = specialCards.DOGS;
                this.value = 0;
                break;
            case specialCards.PHOENIX:
                this.cardImg = cardImages.phoenix;
                this.alt = specialCards.PHOENIX;
                this.value = 0.5;
                this.tempName = '';
                this.tempValue = 0.5;
                break;
            case specialCards.MAJONG:
                this.cardImg = cardImages.majong;
                this.alt = specialCards.MAJONG;
                this.value = 1;
                break;
            case specialCards.DRAGON:
                this.cardImg = cardImages.dragon;
                this.alt = specialCards.DRAGON;
                this.value = 20;
                break;
            default:
                // normal card, color is not null
                this.cardImg = normalCards.get(name)[color];
                this.alt = name + "_" + color;
                this.value = normalCards.get(name).value;
                break;
        }
        this.name = name;
        this.isSelected = false;
        this.key = this.alt;
        this.color = color;
    };

    static compareCards(a, b) {
        return b.value - a.value;
    }
};
