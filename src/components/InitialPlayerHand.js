import { Component } from "react";
import { CardInfo } from "../CardInfo";
import { Card } from "./Card";
import { playerKeys, gameBets } from "../GameLogic";
import { voidAction, voidButton } from "../void";

import { grandTichuBetDivClass, preTradePlayerBoxClass, tichuBetDivClass } from "./styleUtils";
import * as styles from "../styles/Components.module.css"

export class InitialPlayerHand extends Component {

    selfIndex = playerKeys.indexOf(this.props.id);
    teammateIndex = (this.selfIndex + 2) % 4;
    leftIndex = this.selfIndex > 0 ? this.selfIndex - 1 : 3;
    rightIndex = (this.selfIndex + 1) % 4;

    state = {
        cardsExpanded: false,
        tradesSent: false,
        tradesReceived: false,
        /**
         * 0: left opponent, 1: teammate, 2: right opponent
         * */
        trades: [
            [playerKeys[this.leftIndex], undefined],
            [playerKeys[this.teammateIndex], undefined],
            [playerKeys[this.rightIndex], undefined]
        ],
        indexes: {
            teammate: (this.selfIndex + 2) % 4,
            left: this.selfIndex > 0 ? this.selfIndex - 1 : 3,
            right: (this.selfIndex + 1) % 4
        }
    }

    grandTichuBet = () => {
        this.props.placeBet(this.props.id, gameBets.GRAND_TICHU);
    }

    tichuBet = () => {
        this.props.placeBet(this.props.id, gameBets.TICHU);
    }

    expandCards = () => {
        this.setState({
            cardsExpanded: true
        })
    }

    receiveTrades = () => {
        this.setState({
            tradesReceived: true
        })
        this.props.receiveCards(this.props.id);
    }

    sendTrades = () => {
        if ( !this.state.trades.some( ([, card]) => card === undefined )) {
            this.props.sendCards(this.props.id, this.state.trades);
            this.setState({
                tradesSent: true
            })
        }
        else {
            window.alert('You must select a card for each of the other players.');
        }
    }

    cardClicked = (key) => {
        let target = this.props.cards.find(card => card.key === key);
        if (this.state.cardsExpanded && !this.state.tradesSent) {
            if (!target.isSelected) {
                const freeIndex = this.state.trades.findIndex( ([, card]) => card === undefined );
                if (freeIndex !== -1) {
                    let newTrades = this.state.trades.reduce((newTrades, [player, element], index) => {
                        if (index !== freeIndex) {
                            newTrades.push([player, element]);
                        }
                        else {
                            newTrades.push([player, target]);
                        }
                        return newTrades;
                    }, []);
                    target.isSelected = true;
                    this.setState({
                        trades: newTrades
                    });
                }
            }
            else {
                const targetIndex = this.state.trades.findIndex( ([, card]) => card !== undefined && card.key === key );
                let newTrades = this.state.trades.reduce((array, [player ,element], index) => {
                    if (index !== targetIndex) {
                        array.push([player, element]);
                    }
                    else {
                        array.push([player, undefined]);
                    }
                    return array;
                }, [])
                target.isSelected = false;
                this.setState({
                    trades: newTrades
                });
            }
        }
        else {
            target.isSelected = !target.isSelected;
        }
    }

    getBetMessageElement = () => {
        switch (this.props.currentBet) {
            case gameBets.TICHU:
                return (
                    <div className={tichuBetDivClass}>
                        Tichu
                    </div>
                );
            case gameBets.GRAND_TICHU:
                return (
                    <div className={grandTichuBetDivClass}>
                        Grand Tichu
                    </div>
                );
            default:
                return <span></span>;
        }
    }

    preExpansionElements = () => {
        let cards = [];
        this.props.cards.slice(0,8).sort(CardInfo.compareCards).forEach((card) => {
            const cardStyle = {
                position: 'absolute',
                left: (cards.length * 6.5).toString() + '%',
                bottom: '20%',
                height: '70%'
            }
            cards.push(
                <Card key={card.key} id={card.key} cardImg={card.cardImg}
                alt={card.alt} selected={true}
                clickCallback={this.cardClicked} style={cardStyle}/>
            );
        });
        let betMessage = this.getBetMessageElement();
        let grandTichuButton = <span></span>;
        if (this.props.currentBet === gameBets.NONE) {
            grandTichuButton =  <button className={styles.tradePhaseButton} onClick={this.grandTichuBet}>
                                    Grand Tichu
                                </button>;
        }

        return (
            <div className={preTradePlayerBoxClass}>
                <div className={styles.playerInfo}>
                    <span className={styles.playerIDSpan}>{this.props.id}</span>
                    {betMessage}
                </div>
                <div className={styles.preTradeCardList}>
                    {cards}
                </div>
                <div className={styles.tradingCardSlots}/>
                <div className={styles.tradePhaseButtonContainer}>
                    <button className={styles.tradePhaseButton} onClick={this.expandCards}>Expand Cards</button>
                    {grandTichuButton}
                </div>
            </div>            
        );
    }

    postExpansionElements = () => {
        let elements = {
            nonSelectedCards: [],
            selectedCards: [],
            button: undefined,
        }

        this.props.cards.sort(CardInfo.compareCards).forEach((card) => {
            if (!card.isSelected) {
                const cardStyle = {
                    position: 'absolute',
                    left: (elements.nonSelectedCards.length * 6.5).toString() + '%',
                    bottom: '20%',
                    height: '70%'
                }
                elements.nonSelectedCards.push(
                    <Card key={card.key} id={card.key} cardImg={card.cardImg}
                    alt={card.alt} selected={true}
                    clickCallback={this.cardClicked} style={cardStyle}/>
                );
            }
        });

        this.createInnerElements(elements);
        let betMessage = this.getBetMessageElement();
        let tichuButton = <span></span>;
        if (this.props.currentBet === gameBets.NONE) {
            tichuButton =   <button className={styles.tradePhaseButton} onClick={this.tichuBet}>
                                Tichu
                            </button>;
        }

        return (
            <div className={preTradePlayerBoxClass}>
                <div className={styles.playerInfo}>
                    <span className={styles.playerIDSpan}>{this.props.id}</span>
                    {betMessage}
                </div>
                <div className={styles.preTradeCardList}>
                    {elements.nonSelectedCards}
                </div>
                <div className={styles.tradingCardSlots}>
                    {elements.selectedCards}
                </div>
                <div className={styles.tradePhaseButtonContainer}>
                    {elements.button}
                    {tichuButton}
                </div>
            </div>            
        );
    }

    mainComponent = () => {
        if (this.state.cardsExpanded) {
            return this.postExpansionElements()
        }
        return this.preExpansionElements();
    }

    createInnerElements = (elements) => {
        let slotsArray;
        if (this.props.incomingCards.length === 3 && this.state.tradesSent) {
            slotsArray = [];
            slotsArray.push(this.props.incomingCards.find(
                ([key, ]) => key === playerKeys[this.leftIndex] ));
            slotsArray.push(this.props.incomingCards.find(
                ([key, ]) => key === playerKeys[this.teammateIndex] ));
            slotsArray.push(this.props.incomingCards.find(
                ([key, ]) => key === playerKeys[this.rightIndex] ));
            if (!this.state.tradesReceived) {
                elements.button =   <button className={styles.tradePhaseButton} onClick={this.receiveTrades}>
                                        Receive
                                    </button>;
            }
            else {
                elements.button =   <button className={styles.inactiveButton} onClick={voidButton}>
                                        Received
                                    </button>;
            }
        }
        else {
            slotsArray = this.state.trades;
            if (this.state.tradesSent) {
                elements.button =   <button className={styles.inactiveButton} onClick={voidButton}>
                                        Cards Sent
                                    </button>;
            }
            else {
                elements.button =   <button className={styles.tradePhaseButton} onClick={this.sendTrades}>
                                        Send
                                    </button>;
            }
        }

        slotsArray.forEach(([player, card], index) => {
            const cardStyle = {
                height: '70%'
            }
            elements.selectedCards.push(
                <div key={index} className={styles.tradingCardSlot}>
                    <span>{player}</span>
                    {card !== undefined ?
                        <Card key={card.key} id={card.key} cardImg={card.cardImg}
                        alt={card.alt} selected={true}
                        clickCallback={!this.state.tradesSent ? this.cardClicked : voidAction}
                        style={cardStyle}/> :
                        <span></span>
                    }
                </div>
            );
        });
    }
    
    render() {
        return this.mainComponent();
    }
}
