import { Component } from "react";
import { CardInfo } from "../CardInfo";
import { Card } from "./Card";
import { playerKeys } from "../GameLogic";

import * as styles from "../styles/Components.module.css"

export class InitialPlayerHand extends Component {

    state = {
        cardsExpanded: false,
        tradesSent: false,
        /**
         * 0: left opponent, 1: teammate, 2: right opponent
         * */
        trades: [
            undefined,
            undefined,
            undefined
        ]
    }
    
    voidButton = (event) => {
        event.preventDefault();
    }

    expandCards = () => {
        this.setState({
            cardsExpanded: true
        })
    }

    sendTrades = () => {
        this.props.sendCards(this.props.id, this.state.trades);
    }

    cardClicked = (key) => {
        let target = this.props.cards.find(card => card.key === key);
        if (this.state.cardsExpanded && !this.state.tradesSent) {
            if (target.isSelected) {
                const freeIndex = this.state.trades.indexOf(undefined);
                if (freeIndex !== -1) {
                    let newTrades = this.state.trades.reduce((newTrades, element, index) => {
                        if (index !== freeIndex) {
                            newTrades.push(element);
                        }
                        else {
                            newTrades.push(target);
                        }
                    }, [])
                    this.setState({
                        trades: newTrades
                    });
                }
            }
            else {
                const targetIndex = this.state.trades.find(card => card.key === key);
                let newTrades = this.state.trades.reduce((newTrades, element, index) => {
                    if (index !== targetIndex) {
                        newTrades.push(element);
                    }
                    else {
                        newTrades.push(undefined);
                    }
                }, [])
                this.setState({
                    trades: newTrades
                });
            }
        }
        target.isSelected = !target.isSelected;
    }

    renderedMainBox = () => {
        let nonSelectedCards = [];
        this.props.cards.sort(CardInfo.compareCards).forEach((card, index) => {
            if (!card.isSelected) {
                const cardStyle = {
                    zindex: index.toString(),
                    position: 'absolute',
                    left: (index * 6.5).toString() + '%',
                    bottom: '20%',
                    width: '12%',
                    height: '54%'
                }
                nonSelectedCards.push(
                    <Card key={card.key} id={card.key} cardImg={card.cardImg}
                    alt={card.alt} selected={card.isSelected} 
                    clickCallback={this.cardClicked} style={cardStyle}/>
                );
            }
        });
        return (
            <div className={styles.playerBox}>
                <span className={styles.playerIDSpan}>{this.props.id}</span>
                <div className={styles.playerCardList}>
                    {nonSelectedCards}
                </div>
                {
                    // 3 slots for trading cards
                }
            </div>            
        )
    }
    
    render() {
        return <div></div>
    }
}
