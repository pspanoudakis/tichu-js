import React, {Component} from 'react';
import { Card } from './Card';

function compareCards(a, b) {
    return b.value - a.value;
}

export class PlayerHand extends Component {
    voidButton = (event) => {
        event.preventDefault();
    }

    hasSelectedCards = () => {
        return this.props.cards.find(card => card.isSelected ===true) !== undefined;
    }

    cardClicked = (key) => {
        let target = this.props.cards.find(card => card.key === key);
        target.isSelected = !target.isSelected;
        this.setState({});
    }

    playCards = () => {
        this.props.playCards(this.props.id);       
    }

    passTurn = () => {
        this.props.passTurn(this.props.id);
    }

    renderedCards = () => {
        const playerBox = {
            width: '100%',
            height: '90%',
            border: '1px solid white',
        }
        const playerCardList = {
            display: 'flex',
            height: '90%',
            position: 'relative'
        }
        let cardComponents = []
        this.props.cards.sort(compareCards).forEach((card, index) => {
            const cardStyle = {
                zindex: index.toString(),
                position: 'absolute',
                left: (index * 6.5).toString() + '%',
                bottom: (card.isSelected ? '40%' : '30%'),
                width: '13%',
                height: '50%'
            }
            cardComponents.push(
                <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked} style={cardStyle}/>
            );
        });
        return (
            <div style={playerBox}>
                <span style={{paddingLeft: '2%'}}>{this.props.id}</span>
                <div style={playerCardList}>
                    {cardComponents}
                </div>
            </div>
            
        )
    }

    render() {
        let playCardsButton = '';
        let passButton = '';
        if (this.props.hasTurn) {
            if (this.hasSelectedCards()) {
                playCardsButton = <button onClick={this.playCards}>Play Cards</button>;
            }
            else {
                playCardsButton = <button onClick={this.voidButton} style={{opacity: '0.5'}}>Play Cards</button>;
            }
            if (this.props.canPass) {
                passButton = <button onClick={this.passTurn}>Pass</button>
            }
        }
        return (
            <div style={this.props.style}>
                {this.renderedCards()}
                {playCardsButton}{passButton}
            </div>
        )
    }
}
