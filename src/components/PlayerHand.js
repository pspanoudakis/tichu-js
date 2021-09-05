import React, {Component} from 'react';
import { CardInfo, specialCards } from '../CardInfo';
import { Card } from './Card';
import { RequestSelectionBox } from './RequestSelectionBox';
import { PhoenixSelectionMenu } from './PhoenixSelectionMenu';

export class PlayerHand extends Component {
    voidButton = (event) => {
        event.preventDefault();
    }

    hasSelectedCards = () => {
        return this.props.cards.find(card => card.isSelected === true) !== undefined;
    }

    cardClicked = (key) => {
        let target = this.props.cards.find(card => card.key === key);
        target.isSelected = !target.isSelected;
        this.setState({});
    }

    madeRequestSelection = (cardName) => {
        this.props.selectionMade(cardName);
    }

    playCards = () => {
        this.props.playCards(this.props.id);       
    }

    passTurn = () => {
        this.props.passTurn(this.props.id);
    }

    dropBomb = () => {
        this.props.dropBomb(this.props.id);
    }

    renderedMainBox = () => {
        const playerBox = {
            display: 'grid',
            gridTemplateRows: '2.5% 80% 8.75% 8.75%',
            gridTemplateColumns: '100%',
            width: '100%',
            height: '90%',
            border: '1px solid white'
        }
        const playerCardList = {
            display: 'flex',
            height: '100%',
            position: 'relative'
        }
        let cardComponents = []
        this.props.cards.sort(CardInfo.compareCards).forEach((card, index) => {
            const cardStyle = {
                zindex: index.toString(),
                position: 'absolute',
                left: (index * 6.5).toString() + '%',
                bottom: (card.isSelected ? '30%' : '20%'),
                width: '12%',
                height: '54%'
            }
            cardComponents.push(
                <Card key={card.key} id={card.key} cardImg={card.cardImg}
                alt={card.alt} selected={card.isSelected} 
                clickCallback={this.cardClicked} style={cardStyle}/>
            );
        });
        const phoenix = this.props.cards.find(card => card.name === specialCards.PHOENIX);
        const selectedCards = this.props.cards.filter(card => card.isSelected);
        return (
            <div style={playerBox}>
                <span style={{paddingLeft: '2%'}}>{this.props.id}</span>
                <div style={playerCardList}>
                    {cardComponents}
                </div>
                {this.props.displaySelectionBox && this.props.cards.some(card => 
                card.name === specialCards.MAJONG && card.isSelected)
                ? <RequestSelectionBox requestMade={this.madeRequestSelection}/>
                : this.props.pendingRequest}
                { (selectedCards.length >= 5 && phoenix !== undefined && phoenix.isSelected) 
                ? <PhoenixSelectionMenu phoenix={phoenix}></PhoenixSelectionMenu>
                : ''}
            </div>            
        )
    }

    render() {
        let playCardsButton = '';
        let passButton = '';
        let bombButton = '';
        if (this.props.showOptions) {
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
            if (this.props.canBomb) {
                bombButton = <button onClick={this.dropBomb}>Bomb</button>
            }
        }
        let divStyle = {
            marginBottom: '20%',
        }
        Object.assign(divStyle, this.props.style);
        return (
            <div style={divStyle}>
                {this.renderedMainBox()}
                {playCardsButton}{passButton}{bombButton}
            </div>
        )
    }
}
