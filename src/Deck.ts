import { cardColors, CardInfo, PhoenixCard, specialCards } from "./CardInfo";

/**
 * Shuffles the specified array.
 * 
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffle(array: Array<any>) {
    var currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

/** Represents a shuffled card deck. */
export class Deck {
    cards: Array<CardInfo>

    constructor() {
        this.cards = [];
        // Place all the special cards first
        this.cards.push(new CardInfo(specialCards.DOGS));
        this.cards.push(new PhoenixCard());
        this.cards.push(new CardInfo(specialCards.MAHJONG));
        this.cards.push(new CardInfo(specialCards.DRAGON));

        // For each other card name, place 1 card for each color
        for (let i = 2; i <= 10; i++) {
            for (const [, color] of Object.entries(cardColors)) {
                this.cards.push(new CardInfo(i.toString(), color))
            }            
        }
        let letters = ['J', 'Q', 'K' , 'A'];
        for (const letter of letters) {
            for (const [, color] of Object.entries(cardColors)) {
                this.cards.push(new CardInfo(letter, color))
            }
        }
        
        shuffle(this.cards);
    }
}
