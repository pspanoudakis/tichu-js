import { Component } from "react";
import { CardInfo } from "../CardInfo";
import { Card } from "./Card";
import { playerKeys } from "../GameLogic";

import * as styles from "../styles/Components.module.css"

export class InitialPlayerHand extends Component {

    selfIndex = playerKeys.indexOf(this.props.id);
    teammateIndex = (this.selfIndex + 2) % 4;
    leftIndex = this.selfIndex > 0 ? this.selfIndex - 1 : 3;
    rightIndex = (this.selfIndex + 1) % 4;

    state = {
        //cardsExpanded: false,
        cardsExpanded: true,
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
    
    voidButton = (event) => {
        event.preventDefault();
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

    mainComponent = () => {
        let elements = {
            nonSelectedCards: [],
            selectedCards: [],
            button: undefined,
        }
        this.props.cards.sort(CardInfo.compareCards).forEach((card) => {
            if (!card.isSelected) {
                const cardStyle = {
                    zindex: elements.nonSelectedCards.length.toString(),
                    position: 'absolute',
                    left: (elements.nonSelectedCards.length * 6.5).toString() + '%',
                    bottom: '20%',
                    width: '11%',
                    height: '70%'
                }
                elements.nonSelectedCards.push(
                    <Card key={card.key} id={card.key} cardImg={card.cardImg}
                    alt={card.alt} selected={card.isSelected} 
                    clickCallback={this.cardClicked} style={cardStyle}/>
                );
            }
        });

        this.createInnerElements(elements);

        return (
            <div className={styles.preTradePlayerBox}>
                <span className={styles.playerIDSpan}>{this.props.id}</span>
                <div className={styles.preTradeCardList}>
                    {elements.nonSelectedCards}
                </div>
                <div className={styles.tradingCardSlots}>
                    {elements.selectedCards}
                </div>
                <div className={styles.sendCardsButtonContainer}>
                    {elements.button}
                </div>
            </div>            
        );
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
                elements.button =   <button className={styles.sendCardsButton} onClick={this.receiveTrades}>
                                        Receive
                                    </button>;
            }
            else {
                elements.button =   <button className={styles.cardsSentButton} onClick={this.voidButton}>
                                        Received
                                    </button>;
            }
        }
        else {
            slotsArray = this.state.trades;
            if (this.state.tradesSent) {
                elements.button =   <button className={styles.cardsSentButton} onClick={this.voidButton}>
                                        Cards Sent
                                    </button>;
            }
            else {
                elements.button =   <button className={styles.sendCardsButton} onClick={this.sendTrades}>
                                        Send
                                    </button>;
            }
        }

        slotsArray.forEach(([player, card]) => {
            const cardStyle = {
                width: '37.5%',
                height: '55%'
            }
            elements.selectedCards.push(
                <div className={styles.tradingCardSlot}>
                    <span>{player}</span>
                    {card !== undefined ?
                        <Card key={card.key} id={card.key} cardImg={card.cardImg}
                        alt={card.alt} selected={card.isSelected} 
                        clickCallback={!this.state.tradesSent ? this.cardClicked : this.voidButton}
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
