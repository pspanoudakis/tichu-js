import { CardInfo, PhoenixCard, specialCards } from "./CardInfo";
import {
            CardCombination,
            cardCombinations,
            SingleCard,
            CardCouple,
            Triplet,
            FullHouse,
            Steps,
            Kenta,
            Bomb,
            UnexpectedCombinationType
        } from "./CardCombinations";
import { Deck } from "./Deck";

export const playerKeys = ['player1', 'player2', 'player3', 'player4'];

/** Possible player bet points */
export enum gameBets {
    NONE = 0,
    TICHU = 100,
    GRAND_TICHU = 200
}

/** Helper interfaces for Game Logic methods */

interface GameState {
    previousGames: Array<[number, number]>,
    team02TotalPoints: number,
    team13TotalPoints: number,
    winningScore: number,
    gameOver: boolean
}

interface PlayerCards {
    [playerKey: string]: Array<CardInfo>
}

interface TeamsPoints {
    team02: number,
    team13: number
}

interface GameboardState {
    deck: Deck;
    playerHands: PlayerCards;
    playerHeaps: PlayerCards;
    playerTrades: {
        [playerKey: string]: Array<[string, CardInfo]>
    };
    playerBets: {
        [playerKey: string]: number
    };
    sentTrades: number;
    receivedTrades: number;
    tradingPhaseCompleted: boolean;
    currentPlayerIndex: number;
    pendingMahjongRequest: string;
    pendingDragonToBeGiven: boolean;
    pendingBombToBePlayed: boolean;
    table: {
        previousCards: Array<CardInfo>,
        currentCards: Array<CardInfo>,
        combination: CardCombination | null,
        currentCardsOwnerIndex: number,
        requestedCardName: string
    };
    gameRoundWinnerKey: string;
}
interface NewGameboardState {
    playerHands?: PlayerCards;
    playerHeaps?: PlayerCards;
    playerTrades?: {
        [playerKey: string]: Array<CardInfo>
    };
    playerBets?: {
        [playerKey: string]: number
    };
    sentTrades?: number;
    currentPlayerIndex?: number;
    pendingMahjongRequest?: string;
    pendingDragonToBeGiven?: boolean;
    pendingBombToBePlayed?: boolean;
    table?: {
        previousCards: Array<CardInfo>,
        currentCards: Array<CardInfo>,
        combination: CardCombination | null,
        currentCardsOwnerIndex: number,
        requestedCardName: string
    };
    gameRoundWinnerKey?: string;
}

interface GameboardComponent {
    state: GameboardState;
    setState: (newState: NewGameboardState) => void
}

interface PlayerPossibleActions {
    canBetTichu: boolean,
    hasTurn: boolean,
    canPass: boolean,
    displaySelectionBox: boolean,
    pendingRequest: string,
    canBomb: boolean,
}

interface RequestedCardObject {
    card: string
}

/**
 * Contains several game logic related routines that modify
 * the Gameboard UI component state when needed.
 */
export class GameLogic {

    static gameShouldEnd(gameState: GameState) {
        return (gameState.winningScore === 0 ||
                gameState.team02TotalPoints >= gameState.winningScore ||
                gameState.team13TotalPoints >= gameState.winningScore);
    }

    static mustEndGameRound(gameboard: GameboardComponent) {
        if (gameboard.state.playerHands[playerKeys[0]].length === 0 &&
            gameboard.state.playerHands[playerKeys[2]].length === 0) {
                return true;
            }
        if (gameboard.state.playerHands[playerKeys[1]].length === 0 &&
            gameboard.state.playerHands[playerKeys[3]].length === 0) {
                return true;
            }
        return false;
    }

    static evaluateTeamPoints(gameboard: GameboardComponent, points: TeamsPoints) {
        let playerHeaps: PlayerCards = {
            player1: [],
            player2: [],
            player3: [],
            player4: []
        };
        const winnerKey = gameboard.state.gameRoundWinnerKey;
        playerKeys.forEach( (key, index) => {
            if (gameboard.state.table.currentCardsOwnerIndex === index) {
                if (gameboard.state.table.currentCards[0].name !== specialCards.DRAGON) {
                    playerHeaps[key].push(...gameboard.state.table.currentCards,
                                          ...gameboard.state.table.previousCards);
                }
            }
            if (gameboard.state.playerHands[key].length > 0) {
                if (gameboard.state.table.currentCards[0].name === specialCards.DRAGON) {
                    playerHeaps[winnerKey].push(...gameboard.state.table.currentCards,
                                                ...gameboard.state.table.previousCards);
                }
                playerHeaps[winnerKey].push(...playerHeaps[key], ...gameboard.state.playerHeaps[key]);
                if (index % 2 === 0) {
                    points.team13 += GameLogic.evaluatePoints(gameboard.state.playerHands[key]);
                }
                else {
                    points.team02 += GameLogic.evaluatePoints(gameboard.state.playerHands[key]);
                }
            }
            else {
                for (const card of gameboard.state.playerHeaps[key]) {
                    playerHeaps[key].push(card);
                }
            }
        } );
        playerKeys.forEach( (key, index) => {
            if (index % 2 === 0) {
                points.team02 += GameLogic.evaluatePoints(playerHeaps[key]);
            }
            else {
                points.team13 += GameLogic.evaluatePoints(playerHeaps[key]);
            }
        } );
    }

    static evaluatePlayerBets(gameboard: GameboardComponent, points: TeamsPoints) {
        playerKeys.forEach((playerKey, index) => {
            let contribution = 0;
            if (gameboard.state.gameRoundWinnerKey === playerKey) {
                contribution += gameboard.state.playerBets[playerKey];
            }
            else {
                contribution -= gameboard.state.playerBets[playerKey];
            }
            if (index % 2 === 0) {
                points.team02 += contribution;
            }
            else {
                points.team13 += contribution;
            }
        });
    }

    static endGameRound(gameboard: GameboardComponent, points: TeamsPoints) {
        window.alert('Round Ended');

        let activePlayers = playerKeys.reduce( (active, key) => {
            return active + (gameboard.state.playerHands[key].length > 0 ? 1 : 0);
        }, 0);
        if (activePlayers > 1) {
            if (playerKeys.indexOf(gameboard.state.gameRoundWinnerKey) % 2 === 0) {
                points.team02 += 200;
            }
            else {
                points.team13 += 200;
            }
        }
        else {
            GameLogic.evaluateTeamPoints(gameboard, points);
        }
        GameLogic.evaluatePlayerBets(gameboard, points);
    }

    static mahjongIsPlayable(gameboard: GameboardComponent) {
        return gameboard.state.table.currentCards.length === 0 || 
        gameboard.state.table.currentCards[0].name === specialCards.PHOENIX;
    }

    static isPlayable(tableCombination: CardCombination | null, selectedCombination: CardCombination) {
        if (tableCombination !== null) {
            if (selectedCombination instanceof Bomb) {
                if (tableCombination instanceof Bomb) {
                    return Bomb.compareBombs(selectedCombination, tableCombination) > 0;
                }
                return true;
            }
            if (selectedCombination.combination === tableCombination.combination) {
                return tableCombination.compareCombination(selectedCombination) < 0;
            }
            return false;
        }
        return true;
    }

    static canPassTurn(tableCombination: CardCombination | null, requestedCard: string, playerCards: Array<CardInfo>) {
        if (requestedCard === "") { return true; }
        if (tableCombination !== null) {
            switch(tableCombination.combination) {
                case cardCombinations.BOMB:
                    if (tableCombination.compare(playerCards, requestedCard) < 0) {
                        return false;
                    }
                    return true;
                case cardCombinations.SINGLE:
                case cardCombinations.COUPLE:
                case cardCombinations.TRIPLET:
                case cardCombinations.FULLHOUSE:
                    if (tableCombination.compare(playerCards, requestedCard) < 0) {
                        return false;
                    }
                    break;
                case cardCombinations.STEPS:
                case cardCombinations.KENTA:
                    if (tableCombination.compare(playerCards, requestedCard, tableCombination.length) < 0) {
                        return false;
                    }
                    break;
                default:
                    throw new UnexpectedCombinationType(tableCombination.combination);
            }
            return Bomb.getStrongestRequested(playerCards, requestedCard) === null;
        }
        else {
            return false;
        }
    }

    static createCombination(cards: Array<CardInfo>, tableCards: Array<CardInfo>) {
        let combination: CardCombination | null = null;
        switch (cards.length) {
            case 1:
                if (cards[0] instanceof PhoenixCard) {
                    if (tableCards.length > 0) {
                        if (tableCards[0].name !== specialCards.DRAGON) {
                            cards[0].tempValue = tableCards[0].value + 0.5;
                        }
                    }
                    else {
                        cards[0].tempValue = 1.5;
                    }
                }
                combination = SingleCard.create(cards);
                break;
            case 2:
                combination = CardCouple.create(cards);
                break;
            case 3:
                combination = Triplet.create(cards);
                break;
            default:
                combination = Bomb.createBomb(cards);
                if (combination === null) {
                    if (cards.length === 5) {
                        combination = FullHouse.create(cards);
                    }
                    else if (cards.length % 2 === 0) {
                        combination = Steps.create(cards);
                    }
                    if (combination !== null) { return combination; }
                    combination = Kenta.create(cards);
                }
                break;
        }
        return combination;
    }

    static isMahjongCompliant(requestedCard: string, tableCombination: CardCombination | null,
                             allCards: Array<CardInfo>, combination: CardCombination, selectedCards: Array<CardInfo>) {
        if (combination.combination === cardCombinations.BOMB) { return true; }
        if (tableCombination === null) {
            // See if there is *any* valid combination with the requested card
            if (SingleCard.getStrongestRequested(allCards, requestedCard) !== null) {
                if (SingleCard.getStrongestRequested(selectedCards, requestedCard) !== null) {
                    return true;
                }
                return false;
            }
            return true;
        }
        else {
            switch(tableCombination.combination) {
                case cardCombinations.BOMB:
                    return true;
                case cardCombinations.SINGLE:
                case cardCombinations.COUPLE:
                case cardCombinations.TRIPLET:
                case cardCombinations.FULLHOUSE:
                    if (tableCombination.compare(allCards, requestedCard) < 0) {
                        if ( !selectedCards.some(card => card.name === requestedCard)) {
                            return false;
                        }
                    }
                    break;
                case cardCombinations.STEPS:
                case cardCombinations.KENTA:
                    if (tableCombination.compare(allCards, requestedCard, tableCombination.length) < 0) {
                        if ( !selectedCards.some(card => card.name === requestedCard)) {
                            return false;
                        }
                    }
                    break;
                default:
                    return false;
            }
            return true;
        }
    }

    static satisfyRequestIfPossible(requestObject: RequestedCardObject, selectedCards: Array<CardInfo>) {
        if (requestObject.card !== "") {
            if (selectedCards.some(card => card.name === requestObject.card)) {
                requestObject.card = "";
            }
        }
    }

    static playCards(gameboard: GameboardComponent, playerKey: string) {
        let newState: NewGameboardState = {};
        newState.playerHands = {};
        newState.gameRoundWinnerKey = gameboard.state.gameRoundWinnerKey;
        let selectedCards = [];
        let allPlayerCards = [];
        let requestedCard = gameboard.state.table.requestedCardName;
        let nextPlayerIndex = (gameboard.state.currentPlayerIndex + 1) % 4;
        for (const key of playerKeys) {
            if (playerKey !== key) {
                newState.playerHands[key] = gameboard.state.playerHands[key];
            }
            else {
                newState.playerHands[playerKey] = [];
                for (const card of gameboard.state.playerHands[key]) {
                    if (card.isSelected) {
                        selectedCards.push(card);
                    }
                    else {
                        newState.playerHands[playerKey].push(card);
                    }
                    allPlayerCards.push(card);
                }
            }
        }
        let combination = GameLogic.createCombination(selectedCards, gameboard.state.table.currentCards);
        if (combination !== null) {
            if (gameboard.state.pendingMahjongRequest !== '') {
                // If there is a pending mahjong request, the player must play the Mahjong
                if (!selectedCards.some(card => card.name === specialCards.MAHJONG)) {
                    window.alert("The Mahjong must be played after a Mahjong request");
                    return;
                }
                else {
                    requestedCard = gameboard.state.pendingMahjongRequest;
                }
                if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
                    window.alert("This combination cannot be played");
                    return;
                }
            }
            else if (gameboard.state.pendingBombToBePlayed) {
                if (!(combination instanceof Bomb)) {
                    window.alert("A bomb must be played");
                    return;
                }
                else {
                    const tableCombination = gameboard.state.table.combination;
                    if ( tableCombination !== null && 
                         tableCombination instanceof Bomb) {
                        if (Bomb.compareBombs(tableCombination, combination) >= 0) {
                            window.alert("The selected combination cannot be played");
                            return;
                        }
                    }
                    
                }
            }
            else if (gameboard.state.table.requestedCardName !== '') {
                if ( !GameLogic.isMahjongCompliant(gameboard.state.table.requestedCardName,
                     gameboard.state.table.combination, allPlayerCards, combination, selectedCards)) {
                    window.alert("A combination which contains the requested card is required.");
                    return;
                }
                if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
                    window.alert("This combination cannot be played");
                    return;
                }
            }
            else if (selectedCards.some(card => card.name === specialCards.DOGS)) {
                if (gameboard.state.table.combination !== null) {
                    window.alert("Dogs cannot be played on top of other cards.");
                    return;
                }
                nextPlayerIndex = (gameboard.state.currentPlayerIndex + 2) % 4;
                selectedCards = [];
                combination = null;
            }
            else {
                if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
                    window.alert("This combination cannot be played");
                    return;
                }
            }
            let requestObject: RequestedCardObject = { card: requestedCard };
            if (gameboard.state.pendingMahjongRequest === '') {
                GameLogic.satisfyRequestIfPossible(requestObject, selectedCards);
            }
            while (gameboard.state.playerHands[playerKeys[nextPlayerIndex]].length === 0) {
                nextPlayerIndex = (nextPlayerIndex + 1) % 4;
            }
            if (newState.gameRoundWinnerKey === '' && newState.playerHands[playerKey].length === 0) {
                //console.log(`Winner: ${playerKey}`);
                newState.gameRoundWinnerKey = playerKey;
            }
            newState.table = {
                previousCards: gameboard.state.table.previousCards.concat(gameboard.state.table.currentCards),
                currentCards: selectedCards,
                combination: combination,
                currentCardsOwnerIndex: gameboard.state.currentPlayerIndex,
                requestedCardName: requestObject.card
            }
            newState.currentPlayerIndex = nextPlayerIndex;
            newState.pendingDragonToBeGiven = false;
            newState.pendingBombToBePlayed = false;
            newState.pendingMahjongRequest = '';
            gameboard.setState(newState);
        }
        else {
            window.alert('Invalid card combination');
        }
    }

    static passTurn(gameboard: GameboardComponent) {
        const currentPlayerKey = playerKeys[gameboard.state.currentPlayerIndex];
        const currentPlayerHand = gameboard.state.playerHands[currentPlayerKey];
        if (GameLogic.canPassTurn(gameboard.state.table.combination,
            gameboard.state.table.requestedCardName, currentPlayerHand)) {
            let nextPlayerIndex = (gameboard.state.currentPlayerIndex + 1) % 4;
            let newState: NewGameboardState = {};
            while (gameboard.state.playerHands[playerKeys[nextPlayerIndex]].length === 0) {
                if (nextPlayerIndex === gameboard.state.table.currentCardsOwnerIndex) {
                    GameLogic.endRound(gameboard, newState, nextPlayerIndex);
                }
                nextPlayerIndex = (nextPlayerIndex + 1) % 4;
            }
            if (nextPlayerIndex === gameboard.state.table.currentCardsOwnerIndex) {
                GameLogic.endRound(gameboard, newState, nextPlayerIndex);
            }
            newState.currentPlayerIndex = nextPlayerIndex;
            gameboard.setState(newState);
        }
        else {
            window.alert("A combination which contains the requested card is required.");
        }        
    }

    static endRound(gameboard: GameboardComponent, newState: NewGameboardState, cardsOwnerIndex: number) {
        // Preparing for new round
        if (gameboard.state.table.currentCards[0].name === specialCards.DRAGON) {
            GameLogic.giveDragon(gameboard, cardsOwnerIndex);
            return;
        }
        newState.playerHeaps = {}
        for (let i = 0; i < playerKeys.length; i++) {
            newState.playerHeaps[playerKeys[i]] = gameboard.state.playerHeaps[playerKeys[i]];
            if (i === cardsOwnerIndex) {
                newState.playerHeaps[playerKeys[i]].push(...gameboard.state.table.previousCards);
                newState.playerHeaps[playerKeys[i]].push(...gameboard.state.table.currentCards);
                newState.table = {
                    previousCards: [],
                    currentCards: [],
                    currentCardsOwnerIndex: -1,
                    requestedCardName: gameboard.state.table.requestedCardName,
                    combination: null
                };
                //console.log(newState.playerHeaps[playerKeys[i]]);
            }
        }
    }

    static giveDragon(gameboard: GameboardComponent, cardsOwnerIndex: number) {
        gameboard.setState({
            currentPlayerIndex: cardsOwnerIndex,
            pendingDragonToBeGiven: true
        });
    }

    static dragonGiven(gameboard: GameboardComponent, selectedPlayerKey: string) {
        // New current player is already set
        let newState: NewGameboardState = {
            pendingDragonToBeGiven: false
        }
        newState.playerHeaps = {}
        for (let i = 0; i < playerKeys.length; i++) {
            newState.playerHeaps[playerKeys[i]] = gameboard.state.playerHeaps[playerKeys[i]];
            if (playerKeys[i] === selectedPlayerKey) {
                newState.playerHeaps[playerKeys[i]].push(...gameboard.state.table.previousCards);
                newState.playerHeaps[playerKeys[i]].push(...gameboard.state.table.currentCards);
                newState.table = {
                    previousCards: [],
                    currentCards: [],
                    currentCardsOwnerIndex: -1,
                    requestedCardName: gameboard.state.table.requestedCardName,
                    combination: null
                };
                //console.log(newState.playerHeaps[playerKeys[i]]);
            }
        }
        gameboard.setState(newState);
    }

    static handCards(gameboard: GameboardComponent) {
        let playerHands: PlayerCards = {};
        for (const key of playerKeys) {
            playerHands[key] = [];
        }

        let i = 0, card;
        while ((card = gameboard.state.deck.cards.pop()) !== undefined) {
            playerHands[playerKeys[i++]].push(card)
            i %= playerKeys.length;
        }

        gameboard.setState({
            playerHands: playerHands
        });
    }

    static makeCardTrades(gameboard: GameboardComponent) {
        let playerHands: PlayerCards = {
            player1: [],
            player2: [],
            player3: [],
            player4: [],
        };
        let mahjongOwnerIndex = -1;
        playerKeys.forEach( (key, index) => {
            for (const card of gameboard.state.playerHands[key]) {
                if (!card.isSelected) {
                    playerHands[key].push(card);
                    if (card.name === specialCards.MAHJONG) {
                        mahjongOwnerIndex = index;
                    }
                }
            }
            for (const [,card] of gameboard.state.playerTrades[key]) {
                playerHands[key].push(card)
                if (card.name === specialCards.MAHJONG) {
                    mahjongOwnerIndex = index;
                }
            }
        });
        
        gameboard.setState({
            playerHands: playerHands,
            currentPlayerIndex: mahjongOwnerIndex,
            sentTrades: 0
        });
    }

    static getPlayerPossibleActions(gameboard: GameboardComponent, playerIndex: number,
                                    mahjongIsPlayable: boolean, actions: PlayerPossibleActions) {
        if (gameboard.state.playerHands[playerKeys[playerIndex]].length === 14 &&
            gameboard.state.playerBets[playerKeys[playerIndex]] === gameBets.NONE) {
                actions.canBetTichu = true;
        }
        if (actions.hasTurn) {
            actions.canPass = (gameboard.state.table.currentCards.length !== 0) &&
                        (!gameboard.state.pendingBombToBePlayed) &&
                        (gameboard.state.pendingMahjongRequest === '');
            if (!gameboard.state.pendingDragonToBeGiven) {
                let mahjong = gameboard.state.playerHands[playerKeys[playerIndex]].find(
                    card => card.name === specialCards.MAHJONG);
                let pendingRequest = gameboard.state.pendingMahjongRequest !== '';                    
                actions.displaySelectionBox = mahjong !== undefined && !pendingRequest && mahjongIsPlayable
                                                  && !gameboard.state.pendingBombToBePlayed;
                if (pendingRequest) {
                    actions.pendingRequest = 'Requested: ' + gameboard.state.pendingMahjongRequest;
                }
            }
        }
        const bomb = Bomb.getStrongestBomb(gameboard.state.playerHands[playerKeys[playerIndex]]);
        if (bomb !== null) {
            actions.canBomb = gameboard.state.pendingMahjongRequest === ''
                                  && !gameboard.state.pendingBombToBePlayed;
            if (actions.canBomb && gameboard.state.table.combination !== null &&
                gameboard.state.table.combination instanceof Bomb) {
                actions.canBomb = Bomb.compareBombs(gameboard.state.table.combination, bomb) < 0;
            }
        }
    }

    static evaluatePoints(cards: Array<CardInfo>) {
        let points = 0;
        for (const card of cards) {
            switch (card.name) {
                case '5':
                    points += 5;
                    break;
                case '10':
                case 'K':
                    points += 10;
                    break;
                case specialCards.DRAGON:
                    points += 25;
                    break;
                case specialCards.PHOENIX:
                    points -= 25;
                    break;
                default:
                    break;
            }
        }

        return points;
    }
}
