import { cardImages } from "./CardExports";

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
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 2
    },
    3: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 3
    },
    4: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 4
    },
    5: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 5
    },
    6: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 6
    },
    7: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 7
    },
    8: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 8
    },
    9: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 9
    },
    10: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 10
    },
    J: {
        black: cardImages.blue_A,
        red: cardImages.blue_A,
        blue: cardImages.blue_A,
        green: cardImages.blue_A,
        value: 11
    },
    Q: {
        black: cardImages.black_Q,
        red: cardImages.red_Q,
        blue: cardImages.blue_Q,
        green: cardImages.green_Q,
        value: 12
    },
    K: {
        black: cardImages.black_K,
        red: cardImages.red_K,
        blue: cardImages.blue_K,
        green: cardImages.green_K,
        value: 13
    },
    A: {
        black: cardImages.black_A,
        red: cardImages.red_A,
        blue: cardImages.blue_A,
        green: cardImages.green_A,
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
    constructor(name, color = '') {
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
        this.key = this.alt;
    };
};
