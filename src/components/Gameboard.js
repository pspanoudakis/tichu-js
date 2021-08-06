import React, {Component} from 'react';
import { PlayerHand } from './PlayerHand';
import { TableCards } from './TableCards';
import { Deck } from '../Deck';

const playerKeys = ['player1', 'player2', 'player3', 'player4'];

export class Gameboard extends Component {
    state = {
        deck: new Deck(),
        playerHands: {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        },
        currentPlayerIndex: -1,
        table: {
            previousCards: [],
            currentCards: [],
            currentCardsOwnerIndex: -1
        },
        playerHeaps : {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        }
    }

    playerPassedTurn = () => {
        let newState = {
            currentPlayerIndex: (this.state.currentPlayerIndex + 1) % 4
        }
        if (newState.currentPlayerIndex === this.state.table.currentCardsOwnerIndex) {
        // Preparing for new round
            newState.playerHeaps = {}
            for (let i = 0; i < playerKeys.length; i++) {
                newState.playerHeaps[playerKeys[i]] = this.state.playerHeaps[playerKeys[i]];
                if (i === newState.currentPlayerIndex) {
                    newState.playerHeaps[playerKeys[i]].push(...this.state.table.previousCards);
                    newState.playerHeaps[playerKeys[i]].push(...this.state.table.currentCards);
                    newState.table = {};
                    newState.table.previousCards = [];
                    newState.table.currentCards = [];
                    console.log(newState.playerHeaps[playerKeys[i]]);
                }
            }
        }
        this.setState(newState);
    }

    playerPlayerCards = (playerKey) => {
        let selectedCards = [];
        let playerHands = {};
        for (const key of playerKeys) {
            if (playerKey !== key) {
                playerHands[key] = this.state.playerHands[key];
            }
            else {
                playerHands[playerKey] = [];
                for (const card of this.state.playerHands[key]) {
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
            currentPlayerIndex: (this.state.currentPlayerIndex + 1) % 4,
            table: {
                previousCards: this.state.table.previousCards.concat(this.state.table.currentCards),
                currentCards: selectedCards,
                currentCardsOwnerIndex: this.state.currentPlayerIndex
            }
        })
    }

    handCards = () => {
        let playerHands = {};
        for (const key of playerKeys) {
            playerHands[key] = [];
        }

        let i = 0, card;
        while ((card = this.state.deck.cards.pop()) !== undefined) {
            playerHands[playerKeys[i++]].push(card)
            i %= playerKeys.length;
        }

        this.setState({
            playerHands: playerHands,
            currentPlayerIndex: 0
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
                gridRowStart: '3',
                gridRowEnd: '4',
                gridColumnStart: '2',
                gridColumnEnd: '3'
            },
            player4: {
                gridRowStart: '2',
                gridRowEnd: '3',
                gridColumnStart: '3',
                gridColumnEnd: '4'
            }            
        }
        let components = [];
        for (let i = 0; i < playerKeys.length; i++) {
            let hasTurn = false;
            let canPass = false;
            if (this.state.currentPlayerIndex === i) {
                hasTurn = true;
                if (this.state.table.currentCards.length !== 0) {
                    canPass = true;
                }
            }
            styles[playerKeys[i]].height = '100%';
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]} cards={this.state.playerHands[playerKeys[i]]}
                updateTableCards={this.playerPlayerCards} style={styles[playerKeys[i]]}
                hasTurn={hasTurn} canPass={canPass} passTurn={this.playerPassedTurn}/>
            );
        }
        return components;
    }

    render() {
        const style = {
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateRows: '33% 33% 33%',
            gridTemplateColumns: '32.5% 32.5% 32.5%',
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
                {components[3]}
                {components[2]}
                {(this.state.currentPlayerIndex === -1)
                ? <button onClick={this.handCards}>Hand Cards</button>
                : ''}                                
            </div>
        );
    }
}
