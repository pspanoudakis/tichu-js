import { cardColors, CardInfo, normalCards, specialCards } from "./CardInfo";

/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
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

export class Deck {
    constructor() {
        this.cards = [];
        this.cards.push(new CardInfo(specialCards.DOGS));
        this.cards.push(new CardInfo(specialCards.PHOENIX));
        this.cards.push(new CardInfo(specialCards.MAJONG));
        this.cards.push(new CardInfo(specialCards.DRAGON));
        for (let i = 2; i <= 10; i++) {
            for (const [_, color] of Object.entries(cardColors)) {
                this.cards.push(new CardInfo(i.toString(), color))
            }            
        }
        for (const [_, color] of Object.entries(cardColors)) {
            this.cards.push(new CardInfo('J', color))
        }
        for (const [_, color] of Object.entries(cardColors)) {
            this.cards.push(new CardInfo('Q', color))
        }
        for (const [_, color] of Object.entries(cardColors)) {
            this.cards.push(new CardInfo('K', color))
        }
        for (const [_, color] of Object.entries(cardColors)) {
            this.cards.push(new CardInfo('A', color))
        }
        shuffle(this.cards);
    }
}
