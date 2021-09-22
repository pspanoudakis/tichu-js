import { Component } from 'react';
import { PlayerHand } from './PlayerHand';
import { InitialPlayerHand } from './InitialPlayerHand';
import { Table } from './Table';
import { Deck } from '../Deck';
import { GameLogic, playerKeys } from '../GameLogic';

import * as styles from "../styles/Components.module.css"

export class Gameboard extends Component {
    state = {
        deck: (this.props.gameOver ? undefined : new Deck()),
        playerHands: {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        },
        tradingPhaseCompleted: false,
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
        },
        gameRoundWinnerKey: ''
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
        //GameLogic.testHandCards(this)
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

    inactivePlayerComponents = () => {
        let components = [];
        for (let i = 0; i < playerKeys.length; i++) {
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]}
                cards={[]}
                style={styles[playerKeys[i]]}
                hasTurn={false} canPass={false}
                displaySelectionBox={false}
                pendingRequest={''}
                canBomb={false}
                showOptions={false}/>
            );
        }
        return components;
    }

    componentDidMount() {
        if (!this.props.gameOver && this.state.currentPlayerIndex === -1) {
            GameLogic.handCards(this);
        }
    }

    componentDidUpdate() {
        if (GameLogic.mustEndGameRound(this)) {
            let points = {
                team02: 0,
                team13: 0
            }
            GameLogic.endGameRound(this, points);
            this.props.gameRoundEnded(points.team02, points.team13);
        }
    }

    render() {
        
        if (!this.state.tradingPhaseCompleted) {
            let playerComponents = [];
            for (let i = 0; i < playerKeys.length; i++) {
                playerComponents.push(
                    <InitialPlayerHand key={playerKeys[i]} id={playerKeys[i]}
                    cards={this.state.playerHands[playerKeys[i]]}/>
                );
            }
            return (
                <div className={styles.gameboardPreTradesStyle}>
                    <div className={styles.preTradesCol}>
                        {playerComponents[1]}
                    </div>
                    <div className={styles.preTradesCol}>
                        {playerComponents[0]}
                        {playerComponents[2]}
                    </div>
                    <div className={styles.preTradesCol}>
                        {playerComponents[3]}
                    </div>
                </div>
            );
        }

        // The Table must be aware of the active players
        // for an upcoming dragon selection
        let activePlayers = [];
        for (const key of playerKeys) {
            activePlayers.push(this.state.playerHands[key].length > 0);
        }
        let playerComponents;
        if ( !this.props.gameOver ) {
            playerComponents = this.playerComponents();
        }
        else {
            playerComponents = this.inactivePlayerComponents();
        }
        return (
            <div className={styles.gameboardStyle}>
                {playerComponents[0]}
                {playerComponents[1]}
                <div className={styles.tableStyle}>
                    <Table currentCards={this.state.table.currentCards}
                    previousCards={this.state.table.previousCards}
                    playerNames={playerKeys} activePlayers={activePlayers}
                    currentCardsOwnerIndex={this.state.table.currentCardsOwnerIndex}
                    pendingDragon={this.state.pendingDragonToBeGiven}
                    dragonGiven={this.dragonGiven}
                    requestedCard={this.state.table.requestedCardName}/>
                </div>
                {playerComponents[3]}
                {playerComponents[2]}
            </div>
        );
    }
}
