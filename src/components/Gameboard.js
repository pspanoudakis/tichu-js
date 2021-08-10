import React, {Component} from 'react';
import { PlayerHand } from './PlayerHand';
import { Table } from './Table';
import { Deck } from '../Deck';
import { specialCards } from '../CardInfo';
import { BombInfo } from '../BombInfo';

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
        pendingMajongRequest: '',
        pendingDragonToBeGiven: false,
        table: {
            previousCards: [],
            currentCards: [],
            currentCardsOwnerIndex: -1,
            requestedCardName: ''
        },
        playerHeaps : {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        }
    }

    giveDragon = (currentPlayer) => {
        this.setState({
            currentPlayerIndex: currentPlayer,
            pendingDragonToBeGiven: true
        })
    }

    playerPassedTurn = () => {
        let newState = {
            currentPlayerIndex: (this.state.currentPlayerIndex + 1) % 4
        }
        if (newState.currentPlayerIndex === this.state.table.currentCardsOwnerIndex) {
        // Preparing for new round
            if (this.state.table.currentCards[0].name === specialCards.DRAGON) {
                this.giveDragon(newState.currentPlayerIndex);
                return;
            }
            newState.playerHeaps = {}
            for (let i = 0; i < playerKeys.length; i++) {
                newState.playerHeaps[playerKeys[i]] = this.state.playerHeaps[playerKeys[i]];
                if (i === newState.currentPlayerIndex) {
                    newState.playerHeaps[playerKeys[i]].push(...this.state.table.previousCards);
                    newState.playerHeaps[playerKeys[i]].push(...this.state.table.currentCards);
                    newState.table = {};
                    newState.table.previousCards = [];
                    newState.table.currentCards = [];
                    //console.log(newState.playerHeaps[playerKeys[i]]);
                }
            }
        }
        this.setState(newState);
    }

    playerMadeMajongSelection = (cardName) => {
        this.setState({
            pendingMajongRequest: cardName
        });
    }

    playerPlayedCards = (playerKey) => {
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
        if (this.state.pendingMajongRequest !== '') {
            // If there is a pending majong request, the player must play the Majong
            if (!selectedCards.some(card => card.name === specialCards.MAJONG)) {
                    window.alert("The Majong must be played after a Majong request");
                    return;
                }
        }
        else if (this.state.table.requestedCardName !== '') {
            // TODO: If there is an active majong request, the player must play the requested
            // card if present AND playable
            return;
        }
        this.setState({
            playerHands: playerHands,
            currentPlayerIndex: (this.state.currentPlayerIndex + 1) % 4,
            pendingMajongRequest: '',
            pendingDragonToBeGiven: false,
            table: {
                previousCards: this.state.table.previousCards.concat(this.state.table.currentCards),
                currentCards: selectedCards,
                currentCardsOwnerIndex: this.state.currentPlayerIndex,
                requestedCardName: this.state.table.requestedCardName
            }
        })
    }

    handCards = () => {
        let playerHands = {};
        for (const key of playerKeys) {
            playerHands[key] = [];
        }

        let i = 0, card, majongOwnerIndex;
        while ((card = this.state.deck.cards.pop()) !== undefined) {
            if (card.key === specialCards.MAJONG) {
                majongOwnerIndex = i;
            }
            playerHands[playerKeys[i++]].push(card)
            i %= playerKeys.length;
        }

        this.setState({
            playerHands: playerHands,
            currentPlayerIndex: majongOwnerIndex
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
            let hasTurn = this.state.currentPlayerIndex === i;
            let canPass = false;
            let displayMajongRequestBox = false;
            let pendingRequestMessage = '';
            if (hasTurn) {
                canPass = this.state.table.currentCards.length !== 0;
                if (!this.state.pendingDragonToBeGiven) {
                    // TODO: But what if Majong is not playable right now?
                    let hasSelectedMajong = this.state.playerHands[playerKeys[i]].some(
                        card => card.name === specialCards.MAJONG);
                    let pendingRequest = this.state.pendingMajongRequest !== '';
                    displayMajongRequestBox = hasSelectedMajong && !pendingRequest;
                    if (pendingRequest) {
                        pendingRequestMessage = 'Requested: ' + this.state.pendingMajongRequest;
                    }
                }
                
            }
            styles[playerKeys[i]].height = '100%';
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]}
                cards={this.state.playerHands[playerKeys[i]]}
                playCards={this.playerPlayedCards} style={styles[playerKeys[i]]}
                hasTurn={hasTurn} canPass={canPass} passTurn={this.playerPassedTurn}
                showOptions={!this.state.pendingDragonToBeGiven}
                displaySelectionBox={displayMajongRequestBox}
                selectionMade={this.playerMadeMajongSelection}
                pendingRequest={pendingRequestMessage}/>
            );
        }
        return components;
    }

    render() {
        const style = {
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateRows: '32.5% 32.5% 32.5%',
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
                    <Table currentCards={this.state.table.currentCards}
                    previousCards={this.state.table.previousCards}
                    playerNames={playerKeys}
                    currentPlayerIndex={this.state.currentPlayerIndex}
                    pendingDragon={this.state.pendingDragonToBeGiven}/>
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
