import React, {Component} from 'react';
import { Card } from './Card';
//import { CardInfo, cardNames } from '../CardInfo';

function compareCards(a, b) {
    return b.value - a.value;
}

export class PlayerHand extends Component {

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
        const playerBox = {
            display: 'grid',
            gridTemplateRows: '50% 50%',
            gridTemplateColumns: '100%',
            border: '1px solid white',
            width: '100%',
            height: '90%'
        }
        const playerCardList = {
            display: 'flex',
            height: '100%',
            border: '1px solid white',
        }
        const cardStyle = {
            width: '100%',
            height: '66%',
        }
        const cardBox = {
            display: 'grid',
            gridTemplateRows: '25% 75%',
            width: '100%'
        }

        let selected = [];
        let nonSelected = [];
        this.props.cards.forEach( card => {
            (card.isSelected ? selected : nonSelected).push(card);
        } );
        return (
            <div style={playerBox}>
                <div style={cardBox}>
                    Hand
                    <div style={playerCardList}>
                        {nonSelected.sort(compareCards).map( card => 
                        <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                        selected={card.isSelected} clickCallback={this.cardClicked} style={cardStyle}/> )}
                        <br/>
                    </div>
                </div>
                <div style={cardBox}>
                    Selected
                    <div style={playerCardList}>
                        {selected.sort(compareCards).map( card => 
                        <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                        selected={card.isSelected} clickCallback={this.cardClicked} style={cardStyle}/> )}
                    </div>
                </div>
            </div>
            
        )
    }

    render() {
        return (
            <div style={this.props.style}>
                {this.renderedCards()}
                {this.hasSelectedCards() ?
                <button onClick={this.updateTableCards}>Play Cards</button> : 'No cards selected'}
            </div>
        )
    }
}
