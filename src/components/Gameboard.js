import React, {Component} from 'react';
import { PlayerHand } from './PlayerHand';
import { Table } from './Table';
import { Deck } from '../Deck';
import { specialCards } from '../CardInfo';
import { BombInfo } from '../BombInfo';
import { GameLogic } from '../GameLogic';

export const playerKeys = ['player1', 'player2', 'player3', 'player4'];

export class Gameboard extends Component {
    state = {
        deck: new Deck(),
        playerHands: {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        },
        gameHasStarted: false,
        currentPlayerIndex: -1,
        pendingMajongRequest: '',
        pendingDragonToBeGiven: false,
        pendingBombToBePlayed: false,
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

    bombStop = (playerKey) => {
        this.setState({
            currentPlayerIndex: playerKeys.indexOf(playerKey),
            pendingBombToBePlayed: true
        })
    }

    dragonGiven = (selectedPlayerKey) => {
        // New current player is already set
        let newState = {
            pendingDragonToBeGiven: false
        }
        newState.playerHeaps = {}
        for (let i = 0; i < playerKeys.length; i++) {
            newState.playerHeaps[playerKeys[i]] = this.state.playerHeaps[playerKeys[i]];
            if (playerKeys[i] === selectedPlayerKey) {
                newState.playerHeaps[playerKeys[i]].push(...this.state.table.previousCards);
                newState.playerHeaps[playerKeys[i]].push(...this.state.table.currentCards);
                newState.table = {};
                newState.table.previousCards = [];
                newState.table.currentCards = [];
                newState.table.currentCardsOwnerIndex = -1;
                newState.table.requestedCardName = this.state.table.requestedCardName;
                console.log(newState.playerHeaps[playerKeys[i]]);
            }
        }
        this.setState(newState);
    }

    playerPassedTurn = () => {
        GameLogic.passTurn(this);
    }

    playerMadeMajongSelection = (cardName) => {
        this.setState({
            pendingMajongRequest: cardName
        });
    }

    playerPlayedCards = (playerKey) => {
        GameLogic.playCards(this, playerKey);
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
            gameHasStarted: true,
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
            let canDropBomb = false;
            if (hasTurn) {
                canPass = (this.state.table.currentCards.length !== 0) &&
                            (!this.state.pendingBombToBePlayed) &&
                            (this.state.pendingMajongRequest === '');
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
            let bomb = BombInfo.getStrongestBomb(this.state.playerHands[playerKeys[i]]);
            if (bomb !== null) {
                let tableBomb = BombInfo.createBomb(this.state.table.currentCards);
                if (BombInfo.compareBombs(tableBomb, bomb) < 0) {
                    canDropBomb = true;
                }
            }

            styles[playerKeys[i]].height = '100%';
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]}
                cards={this.state.playerHands[playerKeys[i]]}
                playCards={this.playerPlayedCards} style={styles[playerKeys[i]]}
                hasTurn={hasTurn} canPass={canPass} passTurn={this.playerPassedTurn}
                showOptions={!this.state.pendingDragonToBeGiven}
                displaySelectionBox={displayMajongRequestBox && !canDropBomb}
                selectionMade={this.playerMadeMajongSelection}
                pendingRequest={pendingRequestMessage}
                canBomb={canDropBomb && (this.state.pendingMajongRequest === '')}
                dropBomb={this.bombStop}/>
            );
        }
        return components;
    }

    render() {
        if (this.state.gameHasStarted && GameLogic.mustEndGame(this)) {
            return <div>Game Ended</div>
        }
        // The Table must be aware of the active players
        // for an upcoming dragon selection
        let activePlayers = [];
        for (const key of playerKeys) {
            activePlayers.push(this.state.playerHands[key].length > 0);
        }

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
                    playerNames={playerKeys} activePlayers={activePlayers}
                    currentPlayerIndex={this.state.currentPlayerIndex}
                    pendingDragon={this.state.pendingDragonToBeGiven}
                    dragonGiven={this.dragonGiven}/>
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
