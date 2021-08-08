import { cardImages } from "./CardResources";

export const cardColors = {
    //NONE: 'none',
    BLACK: 'black',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
}

export var normalCards = {};
(function initializeNormalCards() {
    for (let i = 2; i <= 10; i++) {
        normalCards[i] = {}
        for (const [,color] of Object.entries(cardColors)) {
            normalCards[i][color] = cardImages[color + '_' + i.toString()];
            normalCards[i].value = i;
        }
    }
    const letterValues = [['J', 11], ['Q', 12], ['K', 13], ['A', 14]];
    for (const [letter, value] of letterValues) {
        normalCards[letter] = {};
        for (const [,color] of Object.entries(cardColors)) {
            normalCards[letter][color] = cardImages[color + '_' + letter];
            normalCards[letter].value = value;
        }
    }
})();

export const specialCards = {
    DOGS: 'Dogs',
    PHOENIX: 'Phoenix',
    MAJONG: 'Majong',
    DRAGON: 'Dragon'
};

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
                this.cardImg = normalCards[name][color];
                this.alt = name + "_" + color;
                this.value = normalCards[name].value;
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
