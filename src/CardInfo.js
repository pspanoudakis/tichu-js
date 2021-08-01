import majong from './res/majong.png'
import phenoix from './res/phenoix.png'
import dogs from './res/dogs.png'
import dragon from './res/dragon.png'

export const cardNames = {
    DOGS: 'Dogs',
    PHENOIX: 'Phenoix',
    MAJONG: 'Majong',
    DRAGON: 'Dragon'
};

export class CardInfo {
    constructor(name, color = null) {
        switch (name) {
            case cardNames.DOGS:
                this.cardImg = dogs;
                this.alt = "Dogs";
                this.value = 0;
                break;
            case cardNames.PHENOIX:
                this.cardImg = phenoix;
                this.alt = "Phenoix";
                this.value = 0.5;
                break;
            case cardNames.MAJONG:
                this.cardImg = majong;
                this.alt = "Majong";
                this.value = 1;
                break;
            case cardNames.DRAGON:
                this.cardImg = dragon;
                this.alt = "Dragon";
                this.value = 20;
                break;
            default:
                break;
        }
        this.isSelected = false;
        this.key = this.alt;
    };
};
