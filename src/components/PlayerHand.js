import React, {Component} from 'react';
import { Card } from './Card';
//import { CardInfo, cardNames } from '../CardInfo';

function compareCards(a, b) {
    return b.value - a.value;
}

export class PlayerHand extends Component {

    add = () => {
        this.props.add(this.props.id);
    }

    hasSelectedCards = () => {
        for (const card of this.props.cards) {
            if (card.isSelected)
            {
                return true;
            }
        }
        return false;
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
        let style = {
            display: 'grid',
            gridTemplateRows: '50% 50%',
            gridTemplateColumns: '100%',
            border: '1px solid white',
            width: '100%',
            height: '100%'
        }
        const cardboxStyle = {
            display: 'flex',
            border: '1px solid white',
        }

        let selected = [];
        let nonSelected = [];
        this.props.cards.forEach( card => {
            (card.isSelected ? selected : nonSelected).push(card);
        } );
        return (
            <div style={style}>
                <div style={cardboxStyle}>
                    Non selected
                    {nonSelected.sort(compareCards).map( card => 
                    <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                    selected={card.isSelected} clickCallback={this.cardClicked}/> )}
                    <br/>
                </div>
                <div style={cardboxStyle}>
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

                {this.hasSelectedCards() ?
                <button onClick={this.updateTableCards}>Play Cards</button> :
                <span/>}

                <button onClick={this.add}/>
            </div>
        )
    }
}
