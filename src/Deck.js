import {cardColors, CardInfo, specialCards} from "./CardInfo";

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
