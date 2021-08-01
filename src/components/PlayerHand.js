import React, {Component} from 'react';
import { Card } from './Card';
import { CardInfo, cardNames } from '../CardInfo';

function compareCards(a, b) {
    return a.value - b.value;
}

export class PlayerHand extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            needUpdate: false
        }
    }

    add = () => {
        let cardObjects = [];
        cardObjects.push(new CardInfo(cardNames.MAJONG));
        cardObjects.push(new CardInfo(cardNames.DRAGON));
        cardObjects.push(new CardInfo(cardNames.DOGS));
        cardObjects.push(new CardInfo(cardNames.PHENOIX));
        this.setState({
            cards: cardObjects,
            selected: []
        })
    }

    cardClicked = (key) => {
        let target = this.state.cards.find(card => card.key === key);
        target.isSelected = !target.isSelected;
        this.setState({});
    }

    renderedCards = () => {
        let selected = [];
        let nonSelected = [];
        this.state.cards.forEach( card => {
            (card.isSelected ? selected : nonSelected).push(card);
        } );
        return (
            <div>
                Non selected
                {nonSelected.sort(compareCards).map( card => 
                <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked}/> )}
                <br/>
                Selected
                {selected.sort(compareCards).map( card => 
                <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked}/> )}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderedCards()}
                <button onClick={this.add}></button>
            </div>
        )
    }
}
