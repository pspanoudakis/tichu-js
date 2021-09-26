import { Component } from 'react';
import { PlayerHand } from './PlayerHand';
import { InitialPlayerHand } from './InitialPlayerHand';
import { Table } from './Table';
import { Deck } from '../Deck';
import { GameLogic, playerKeys, gameBets } from '../GameLogic';

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
        playerTrades: {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        },
        playerBets: {
            player1: gameBets.NONE,
            player2: gameBets.NONE,
            player3: gameBets.NONE,
            player4: gameBets.NONE
        },
        sentTrades: 0,
        receivedTrades: 0,
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

    placeBet = (playerKey, bet) => {
        let playerBets = {
            player1: this.state.playerBets.player1,
            player2: this.state.playerBets.player2,
            player3: this.state.playerBets.player3,
            player4: this.state.playerBets.player4
        }
        playerBets[playerKey] = bet;
        this.setState({
            playerBets: playerBets
        });
    }

    makeTrades = (playerKey, trades) => {
        let playerTrades = {
            player1: this.state.playerTrades.player1,
            player2: this.state.playerTrades.player2,
            player3: this.state.playerTrades.player3,
            player4: this.state.playerTrades.player4
        }
        trades.forEach( ([player, card]) => playerTrades[player].push([playerKey, card]) );
        this.setState({
            sentTrades: this.state.sentTrades + 1,
            playerTrades: playerTrades
        });
    }

    tradeReceived = (playerKey) => {
        const total = this.state.receivedTrades + 1;
        for (const [,card] of this.state.playerTrades[playerKey]) {
            card.isSelected = false;
        }
        this.setState({
            receivedTrades: total,
            tradingPhaseCompleted: total === 4
        })
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
            let actions = {
                canBetTichu: false,
                hasTurn: this.state.currentPlayerIndex === i,
                canPass: false,
                displaySelectionBox: false,
                pendingRequest: '',
                canBomb: false,
            }
            GameLogic.getPlayerPossibleActions(this, i, majongIsPlayable, actions);
            components.push(
                <PlayerHand key={playerKeys[i]} id={playerKeys[i]}
                cards={this.state.playerHands[playerKeys[i]]}
                style={styles[playerKeys[i]]}
                actions={actions}
                currentBet={this.state.playerBets[playerKeys[i]]}
                showOptions={!this.state.pendingDragonToBeGiven}
                placeBet={this.placeBet}
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
        let actions = {
            canBetTichu: false,
            hasTurn: false,
            canPass: false,
            displaySelectionBox: false,
            pendingRequest: '',
            canBomb: false,
        }
        for (const key of playerKeys) {
            components.push(
                <PlayerHand key={key} id={key}
                cards={[]}
                style={styles[key]}
                actions={actions}
                currentBet={gameBets.NONE}
                placeBet={this.placeBet}
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
        if (this.state.tradingPhaseCompleted && GameLogic.mustEndGameRound(this)) {
            let points = {
                team02: 0,
                team13: 0
            }
            GameLogic.endGameRound(this, points);
            this.props.gameRoundEnded(points.team02, points.team13);
        }
        else if (!this.state.tradingPhaseCompleted && this.state.sentTrades === 4) {
            GameLogic.makeCardTrades(this);
        }
    }

    tradePhaseRender = () => {
        let playerComponents = [];
        for (const key of playerKeys) {
            playerComponents.push(
                <InitialPlayerHand key={key} id={key}
                cards={this.state.playerHands[key]}
                incomingCards={this.state.playerTrades[key]}
                currentBet={this.state.playerBets[key]}
                placeBet={this.placeBet}
                sendCards={this.makeTrades}
                receiveCards={this.tradeReceived}/>
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

    inGameRender = () => {
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

    render() {
        if (!this.state.tradingPhaseCompleted && !this.props.gameOver) {
            return this.tradePhaseRender();
        }
        return this.inGameRender();
    }
}
