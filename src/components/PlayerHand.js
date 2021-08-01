import React, {Component} from 'react';
import { Card } from './Card';
//import { CardInfo, cardNames } from '../CardInfo';

function compareCards(a, b) {
    return a.value - b.value;
}

export class PlayerHand extends Component {

    add = () => {
        this.props.add(this.props.id);
    }

    cardClicked = (key) => {
        let target = this.props.cards.find(card => card.key === key);
        target.isSelected = !target.isSelected;
        this.setState({});
    }

    updateTableCards = () => {
        this.props.updateTableCards(this.props.id);
    }

    renderedCards = () => {
        let selected = [];
        let nonSelected = [];
        this.props.cards.forEach( card => {
            (card.isSelected ? selected : nonSelected).push(card);
        } );
        return (
            <div>
                <div style={{display: 'flex'}}>
                    Non selected
                    {nonSelected.sort(compareCards).map( card => 
                    <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                    selected={card.isSelected} clickCallback={this.cardClicked}/> )}
                    <br/>
                </div>
                <div style={{display: 'flex'}}>
                    Selected
                    {selected.sort(compareCards).map( card => 
                    <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                    selected={card.isSelected} clickCallback={this.cardClicked}/> )}
                </div>
            </div>
            
        )
    }

    render() {
        return (
            <div>
                {this.renderedCards()}
                <button onClick={this.add}/>
            </div>
        )
    }
}
