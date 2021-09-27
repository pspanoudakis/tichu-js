import { Component } from 'react';
import { CardInfo, specialCards } from '../CardInfo';
import { Card } from './Card';
import { RequestSelectionBox } from './RequestSelectionBox';
import { PhoenixSelectionMenu } from './PhoenixSelectionMenu';
import { gameBets } from '../GameLogic';
import { voidButton } from '../void';

import * as styles from "../styles/Components.module.css"

export class PlayerHand extends Component {

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

    tichuBet = () => {
        this.props.placeBet(this.props.id, gameBets.TICHU);
    }

    getBetMessageElement = () => {
        switch (this.props.currentBet) {
            case gameBets.TICHU:
                return (
                    <div className={styles.tichuBetMessage}>
                        Tichu
                    </div>
                );
            case gameBets.GRAND_TICHU:
                return (
                    <div className={styles.grandTichuBetMessage}>
                        Grand Tichu
                    </div>
                );
            default:
                return <span></span>;
        }
    }

    renderedMainBox = () => {
        let cardComponents = []
        this.props.cards.sort(CardInfo.compareCards).forEach((card, index) => {
            const cardStyle = {
                zindex: index.toString(),
                position: 'absolute',
                left: (index * 6.5).toString() + '%',
                bottom: (card.isSelected ? '25%' : '15%'),
                width: '11.5%',
                height: '61%'
            }
            cardComponents.push(
                <Card key={card.key} id={card.key} cardImg={card.cardImg}
                alt={card.alt} selected={card.isSelected} 
                clickCallback={this.cardClicked} style={cardStyle}/>
            );
        });
        const phoenix = this.props.cards.find(card => card.name === specialCards.PHOENIX);
        const selectedCards = this.props.cards.filter(card => card.isSelected);
        const betMessage = this.getBetMessageElement();
        return (
            <div className={styles.playerBox}>
                <div className={styles.playerInfo}>
                    <span className={styles.playerIDSpan}>{this.props.id}</span>
                    {betMessage}
                </div>
                <div className={styles.playerCardList}>
                    {cardComponents}
                </div>
                {this.props.actions.displaySelectionBox && this.props.cards.some(card => 
                card.name === specialCards.MAJONG && card.isSelected)
                ? <RequestSelectionBox requestMade={this.madeRequestSelection}/>
                : this.props.actions.pendingRequest}
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
        let tichuButton = '';
        if (this.props.showOptions) {
            if (this.props.actions.hasTurn) {
                if (this.hasSelectedCards()) {
                    playCardsButton = <button onClick={this.playCards}>Play Cards</button>;
                }
                else {
                    playCardsButton =   <button className={styles.disabledButton} onClick={voidButton}>
                                        Play Cards
                                        </button>;
                }
                if (this.props.actions.canPass) {
                    passButton = <button onClick={this.passTurn}>Pass</button>
                }
            }
            if (this.props.actions.canBomb) {
                bombButton = <button onClick={this.dropBomb}>Bomb</button>
            }
            if (this.props.actions.canBetTichu) {
                tichuButton = <button onClick={this.tichuBet}>Tichu</button>
            }
        }
        return (
            <div className={this.props.style}>
                {this.renderedMainBox()}
                {playCardsButton}{passButton}{bombButton}{tichuButton}
            </div>
        )
    }
}
