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
        this.forceUpdate()
    }

    phoenixValueSelected = () => {
        this.forceUpdate()
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
        const unselectedEffectOff = !this.props.cards.some(card => card.isSelected);
        let cardComponents = []
        this.props.cards.sort(CardInfo.compareCards).forEach((card, index) => {
            const cardStyle = {
                position: 'absolute',
                left: (index * 6.5).toString() + '%',
                // Maybe place each card in a div, and toggle the distance inside it,
                // so no need to update the whole PlayerHand for each click, but just the specific card.
                bottom: (card.isSelected ? '25%' : '15%'),
                height: '65%',
            }
            cardComponents.push(
                <Card key={card.key} id={card.key} cardImg={card.cardImg}
                alt={card.alt} selected={unselectedEffectOff || card.isSelected}
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
                <div className={styles.selectionsContainer}>
                    {this.props.actions.displaySelectionBox && this.props.cards.some(card => 
                    card.name === specialCards.MAHJONG && card.isSelected)
                    ? <RequestSelectionBox requestMade={this.madeRequestSelection}/>
                    : this.props.actions.pendingRequest}
                    { (selectedCards.length >= 5 && phoenix !== undefined && phoenix.isSelected) 
                    ? <PhoenixSelectionMenu phoenix={phoenix} valueSelected={this.phoenixValueSelected}/>
                    : ''}
                </div>
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
