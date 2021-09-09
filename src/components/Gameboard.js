import React, {Component} from 'react';
import {PlayerHand} from './PlayerHand';
import {Table} from './Table';
import {Deck} from '../Deck';
import {specialCards} from '../CardInfo';
import {Bomb} from '../CardCombinations';
import {GameLogic} from '../GameLogic';

import * as styles from "../styles/Components.module.css"

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
            combination: undefined,
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
        GameLogic.dragonGiven(this, selectedPlayerKey);
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
        GameLogic.handCards(this);
    }

    playerComponents = () => {
        let components = [];
        let majongIsPlayable = GameLogic.majongIsPlayable(this);
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
                    let majong = this.state.playerHands[playerKeys[i]].find(
                        card => card.name === specialCards.MAJONG);
                    let pendingRequest = this.state.pendingMajongRequest !== '';                    
                    displayMajongRequestBox = majong !== undefined && !pendingRequest && majongIsPlayable;
                    if (pendingRequest) {
                        pendingRequestMessage = 'Requested: ' + this.state.pendingMajongRequest;
                    }
                }
            }
            let bomb = Bomb.getStrongestBomb(this.state.playerHands[playerKeys[i]]);
            if (bomb !== null) {
                let tableBomb = Bomb.createBomb(this.state.table.currentCards);
                if (Bomb.compareBombs(tableBomb, bomb) < 0) {
                    canDropBomb = true;
                }
            }
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]}
                cards={this.state.playerHands[playerKeys[i]]}
                playCards={this.playerPlayedCards} style={styles[playerKeys[i]]}
                hasTurn={hasTurn} canPass={canPass} passTurn={this.playerPassedTurn}
                showOptions={!this.state.pendingDragonToBeGiven}
                displaySelectionBox={displayMajongRequestBox && !this.state.pendingBombToBePlayed}
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
        const components = this.playerComponents();
        return (
            <div className={styles.gameboardStyle}>
                {components[0]}
                {components[1]}
                <div className={styles.tableStyle}>
                    <Table currentCards={this.state.table.currentCards}
                    previousCards={this.state.table.previousCards}
                    playerNames={playerKeys} activePlayers={activePlayers}
                    currentPlayerIndex={this.state.currentPlayerIndex}
                    pendingDragon={this.state.pendingDragonToBeGiven}
                    dragonGiven={this.dragonGiven}
                    requestedCard={this.state.table.requestedCardName}/>
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
