import React, {Component} from 'react';
//import { Card } from './Card';
import { CardInfo, cardNames } from '../CardInfo';
import { PlayerHand } from './PlayerHand';
import { TableCards } from './TableCards'

export class Gameboard extends Component {

    state = {
        playerHands: {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        },
        table: {
            previousCards: [],
            currentCards: []
        }
    }

    updateTableCards = (playerKey) => {
        let selectedCards = [];
        let playerHands = {};
        for (const [key, cards] of Object.entries(this.state.playerHands)) {
            if (playerKey !== key) {
                playerHands[key] = cards;
            }
            else {
                playerHands[playerKey] = [];
                for (const card of cards) {
                    if (card.isSelected) {
                        selectedCards.push(card);
                    }
                    else {
                        playerHands[playerKey].push(card);
                    }
                }
            }
        }
        
        this.setState({
            playerHands: playerHands,
            table: {
                previousCards: this.state.table.currentCards,
                currentCards: selectedCards
            }
        })
    }

    // TODO: temporary
    add = (playerKey) => {
        let playerHands = {};
        for (const [key, cards] of Object.entries(this.state.playerHands)) {
            if (playerKey !== key) {
                playerHands[key] = cards;
            }
            else {
                playerHands[playerKey] = [];
            }
        }
        playerHands[playerKey].push(new CardInfo(cardNames.MAJONG));
        playerHands[playerKey].push(new CardInfo(cardNames.DRAGON));
        playerHands[playerKey].push(new CardInfo(cardNames.DOGS));
        playerHands[playerKey].push(new CardInfo(cardNames.PHENOIX));
        this.setState({
            playerHands: playerHands
        });
    }

    playerComponents = () => {
        let components = [];
        for (const [playerKey, cards] of Object.entries(this.state.playerHands)) {
            components.push(
            <PlayerHand key={playerKey} id={playerKey} cards={cards}
            updateTableCards={this.updateTableCards} add={this.add}/>);
        }
        return components;
    }

    render() {
        return (
            <div>
                {this.playerComponents()}
                <TableCards currentCards={this.state.table.currentCards}/>
            </div>
        );
    }
}
