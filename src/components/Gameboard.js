import React, {Component} from 'react';
import {PlayerHand} from './PlayerHand';
import {Table} from './Table';
import {Deck} from '../Deck';
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
        /*
        while (!GameLogic.testHandCards(this)) {
            this.state.deck = new Deck();
        }
        */
    }

    playerComponents = () => {
        let components = [];
        let majongIsPlayable = GameLogic.majongIsPlayable(this);
        for (let i = 0; i < playerKeys.length; i++) {
            let actions = {
                hasTurn: this.state.currentPlayerIndex === i,
                canPass: false,
                displayMajongRequestBox: false,
                pendingRequestMessage: '',
                canDropBomb: false,
            }
            GameLogic.getPlayerPossibleActions(this, i, majongIsPlayable, actions);
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]}
                cards={this.state.playerHands[playerKeys[i]]}
                style={styles[playerKeys[i]]}
                hasTurn={actions.hasTurn} canPass={actions.canPass}
                displaySelectionBox={actions.displayMajongRequestBox}
                pendingRequest={actions.pendingRequestMessage}
                canBomb={actions.canDropBomb}
                showOptions={!this.state.pendingDragonToBeGiven}
                playCards={this.playerPlayedCards}
                passTurn={this.playerPassedTurn}
                selectionMade={this.playerMadeMajongSelection}
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
                    currentCardsOwnerIndex={this.state.table.currentCardsOwnerIndex}
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
