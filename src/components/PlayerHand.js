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

        let selected = [];
        let nonSelected = [];
        this.props.cards.forEach( card => {
            (card.isSelected ? selected : nonSelected).push(card);
        } );
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
            position: 'relative'
        }
        const cardBox = {
            display: 'grid',
            gridTemplateRows: '25% 75%',
            width: '100%'
        }
        return (
            <div style={playerBox}>
                <div style={cardBox}>
                    Hand
                    <div style={playerCardList}>
                        {nonSelected.sort(compareCards).map( (card, index) => {
                            const cardStyle = {
                                zindex: index.toString(),
                                position: 'absolute',
                                top: '0%',
                                left: (index * 6.5).toString() + '%',
                                width: '11.5%',
                                height: '100%'
                            }
                            return <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                            selected={card.isSelected} clickCallback={this.cardClicked} style={cardStyle}/>;
                        })}
                        <br/>
                    </div>
                </div>
                <div style={cardBox}>
                    Selected
                    <div style={playerCardList}>
                        {selected.sort(compareCards).map( (card, index) => {
                            const cardStyle = {
                                zindex: index.toString(),
                                position: 'absolute',
                                top: '0%',
                                left: (index * 6.5).toString() + '%',
                                width: '11.5%',
                                height: '100%'
                            }
                            return <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                            selected={card.isSelected} clickCallback={this.cardClicked} style={cardStyle}/>;
                        })}
                    </div>
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
