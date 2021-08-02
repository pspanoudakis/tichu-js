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
                previousCards: this.state.table.previousCards.concat(this.state.table.currentCards),
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
        let styles = {
            player1: {
                gridRowStart: '1',
                gridRowEnd: '2',
                gridColumnStart: '2',
                gridColumnEnd: '3'
            },
            player2: {
                gridRowStart: '2',
                gridRowEnd: '3',
                gridColumnStart: '1',
                gridColumnEnd: '2'
            },
            player3: {
                gridRowStart: '2',
                gridRowEnd: '3',
                gridColumnStart: '3',
                gridColumnEnd: '4'
            },
            player4: {
                gridRowStart: '3',
                gridRowEnd: '4',
                gridColumnStart: '2',
                gridColumnEnd: '3'
            }
        }
        let components = [];
        for (const [playerKey, cards] of Object.entries(this.state.playerHands)) {
            components.push(
            <div style={styles[playerKey]}>
                <PlayerHand key={playerKey} id={playerKey} cards={cards}
                updateTableCards={this.updateTableCards} add={this.add}/>
            </div>
            );
        }
        return components;
    }

    render() {
        const style = {
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateRows: '33% 34% 33%',
            gridTemplateColumns: '33% 34% 33%'
        }
        const tableStyle = {
            gridRowStart: '2',
            gridRowEnd: '3',
            gridColumnStart: '2',
            gridColumnEnd: '3'
        }
        const components = this.playerComponents();
        return (
            <div style={style}>
                {components[0]}
                {components[1]}
                <div style={tableStyle}>
                <TableCards currentCards={this.state.table.currentCards} previousCards={this.state.table.previousCards}/>
                </div>
                {components[2]}
                {components[3]}                
            </div>
        );
    }
}
