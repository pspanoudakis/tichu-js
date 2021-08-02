import { cardImages } from "./res/CardExports";

export const cardColors = {
    //NONE: 'none',
    BLACK: 'black',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
}

export const normalCards = {
    // Use cardImages
    2: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 2
    },
    3: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 3
    },
    4: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 4
    },
    5: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 5
    },
    6: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 6
    },
    7: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 7
    },
    8: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 8
    },
    9: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 9
    },
    10: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 10
    },
    J: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 11
    },
    Q: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 12
    },
    K: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 13
    },
    A: {
        black: '',
        red: '',
        blue: '',
        green: '',
        value: 14
    }    
}

export const specialCards = {
    DOGS: 'Dogs',
    PHOENIX: 'Phoenix',
    MAJONG: 'Majong',
    DRAGON: 'Dragon'
};

export class CardInfo {
    constructor(name, color = null) {
        switch (name) {
            case specialCards.DOGS:
                this.cardImg = cardImages.dogs;
                this.alt = "Dogs";
                this.value = 0;
                break;
            case specialCards.PHOENIX:
                this.cardImg = cardImages.phoenix;
                this.alt = "Phoenix";
                this.value = 0.5;
                break;
            case specialCards.MAJONG:
                this.cardImg = cardImages.majong;
                this.alt = "Majong";
                this.value = 1;
                break;
            case specialCards.DRAGON:
                this.cardImg = cardImages.dragon;
                this.alt = "Dragon";
                this.value = 20;
                break;
            default:
                // normal card, color is not null
                this.cardImg = normalCards[name][color];
                this.alt = name + "_" + color;
                this.value = normalCards[name].value;
                break;
        }
        this.isSelected = false;
        this.key = this.alt + (color === null ? '' : color);
    };
};
