import React, {Component} from 'react';
import { PlayerHand } from './PlayerHand';
import { TableCards } from './TableCards';
import { Deck } from '../Deck';

export class Gameboard extends Component {

    state = {
        deck: new Deck(),
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

    handCards = () => {
        let playerHands = {};
        let playerKeys = [];
        for (const [key] of Object.entries(this.state.playerHands)) {
            playerKeys.push(key);
            playerHands[key] = [];
        }

        let i = 0, card;
        while ((card = this.state.deck.cards.pop()) !== undefined) {
            playerHands[playerKeys[i++]].push(card)
            i %= playerKeys.length;
        }

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
            styles[playerKey].height = '100%';
            components.push(
                <PlayerHand key={playerKey} id={playerKey} cards={cards}
                updateTableCards={this.updateTableCards} style={styles[playerKey]}/>
            );
        }
        return components;
    }

    render() {
        const style = {
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateRows: '28% 28% 28%',
            gridTemplateColumns: '32% 32% 32%',
            gridColumnGap: '1%',
            gridRowGap: '1%'
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
                <button onClick={this.handCards}>Hand Cards</button>                
            </div>
        );
    }
}
