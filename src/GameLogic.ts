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

    /**
     * Returns `true` if the game should end because the winning score
     * has been reached, `false` otherwise.
     */
    static gameShouldEnd(gameState: GameState) {
        return (gameState.winningScore === 0 ||
                gameState.team02TotalPoints >= gameState.winningScore ||
                gameState.team13TotalPoints >= gameState.winningScore);
    }

    /**
     * Returns `true` if the current game round must end, `false` otherwise.
     */
    static mustEndGameRound(gameboard: GameboardComponent) {
        // End the round if both players of a team have no cards left
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

    /**
     * Evaluates each team's points from the collected cards of each player.
     * @param gameboard: The Gameboard component.
     * @param points: A {@link TeamsPoints} object, with a slot to store each
     * team's points.
     */
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

    /**
     * Evaluates each team's points after taking the player bets into account.
     * @param gameboard The Gameboard component.
     * @param points A {@link TeamsPoints} object, with a slot to store each
     * team's points.
     */
    static evaluatePlayerBets(gameboard: GameboardComponent, points: TeamsPoints) {
        playerKeys.forEach((playerKey, index) => {
            let contribution = 0;
            if (gameboard.state.gameRoundWinnerKey === playerKey) {
                // Add the round winner's bet points
                contribution += gameboard.state.playerBets[playerKey];
            }
            else {
                // For all other players, decrease their teams' points by their bet points.
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

    /**
     * Ends the current game round, and stores the updated team points.
     * @param gameboard The Gameboard component.
     * @param points A {@link TeamsPoints} object, with a slot to store each
     * team's points.
     */
    static endGameRound(gameboard: GameboardComponent, points: TeamsPoints) {
        window.alert('Round Ended');

        let activePlayers = playerKeys.reduce( (active, key) => {
            return active + (gameboard.state.playerHands[key].length > 0 ? 1 : 0);
        }, 0);
        if (activePlayers > 1) {
            // More than 2 players are still active, but the round must end,
            // so one team has a clear round win:
            if (playerKeys.indexOf(gameboard.state.gameRoundWinnerKey) % 2 === 0) {
                points.team02 += 200;
            }
            else {
                points.team13 += 200;
            }
        }
        else {
            // No clear round win, so evaluate the points based on each player's collected cards
            GameLogic.evaluateTeamPoints(gameboard, points);
        }
        // Take the player bets into account as well
        GameLogic.evaluatePlayerBets(gameboard, points);
    }

    /** 
     * Returns `true` if the Mahjong can be played, `false` otherwise.
     */
    static mahjongIsPlayable(gameboard: GameboardComponent) {
        return gameboard.state.table.currentCards.length === 0;
    }

    /**
     * Returns `true` if the target combination can be played on top of the current
     * table combination.
     * @param tableCombination The current table combination (`null` if there isn't one).
     * @param selectedCombination The target combination to be examed.
     */
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

    /**
     * Returns `true` if the player with the specified cards can pass, based on the
     * requested card and the current table combination.
     * @param tableCombination The current table combination.
     * @param requestedCard The requested card name.
     * @param playerCards The player's cards.
     */
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

    /**
     * Attempts to create a combination out of the given cards, to be played
     * on top the specified table cards. Note that the created combination
     * may not be stronger than the table one, and therefore will not be played after all.
     * 
     * @returns The created combination, or `null` if it cannot be created.
     */
    static createCombination(cards: Array<CardInfo>, tableCards: Array<CardInfo>) {
        let combination: CardCombination | null = null;
        switch (cards.length) {
            case 1:
                if (cards[0] instanceof PhoenixCard) {
                    if (tableCards.length > 0) {
                        if (tableCards[0].name !== specialCards.DRAGON) {
                            combination = new SingleCard(tableCards[0].value + 0.5);
                        }
                        // The Phoenix cannot be played on top of the Dragon, so the
                        // combination remains null
                    }
                    else {
                        combination = new SingleCard(1.5);
                    }
                }
                else {
                    combination = new SingleCard(cards[0].value);
                }
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

    /**
     * Returns `true` if the currently selected combination complies with the Mahjong request,
     * `false` otherwise.
     * @param requestedCard The requested card name
     * @param tableCombination The current on-table combination.
     * @param allCards The target player's cards, **both** selected and non-selected.
     * @param combination The combination that is created from the **selected** cards.
     * @param selectedCards The selected cards.
     */
    static isMahjongCompliant(requestedCard: string, tableCombination: CardCombination | null,
                             allCards: Array<CardInfo>, combination: CardCombination, selectedCards: Array<CardInfo>) {
        if (combination.combination === cardCombinations.BOMB) { return true; }
        if (tableCombination === null) {
            // See if there is *any* valid combination with the requested card
            if (SingleCard.getStrongestRequested(selectedCards, requestedCard) === null &&
                SingleCard.getStrongestRequested(allCards, requestedCard) !== null) {
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

    /**
     * Attempts to satisfy the Mahjong request using the selected cards.
     * @param requestObject A {@link RequestedCardObject}. The `card` property will be set to `""`
     * if the request is being satisfied be the cards.
     * @param selectedCards The cards to be played.
     */
    static attemptToSatisfyRequest(requestObject: RequestedCardObject, selectedCards: Array<CardInfo>) {
        if (requestObject.card !== "") {
            if (selectedCards.some(card => card.name === requestObject.card)) {
                requestObject.card = "";
            }
        }
    }

    /**
     * Called when a player attempts to play some cards.
     * 
     * Performs all the necessary checks for the cards to be played. If they can be played,
     * the Gameboard state will be set accordingly, otherwise they will be rejected
     * and an alert message will be displayed to indicate the reason.
     * @param gameboard The Gameboard UI component.
     * @param playerKey The key of the player.
     */
    static playCards(gameboard: GameboardComponent, playerKey: string) {
        let newState: NewGameboardState = {};
        newState.playerHands = {};
        newState.gameRoundWinnerKey = gameboard.state.gameRoundWinnerKey;
        let selectedCards: Array<CardInfo> = [];
        let allPlayerCards: Array<CardInfo> = [];
        let requestedCard = gameboard.state.table.requestedCardName;
        let nextPlayerIndex = (gameboard.state.currentPlayerIndex + 1) % 4;

        GameLogic.filterNextPlayerHands(gameboard, newState, allPlayerCards, selectedCards, playerKey);

        let combination = GameLogic.createCombination(selectedCards, gameboard.state.table.currentCards);
        if (combination !== null) {
            if (gameboard.state.pendingMahjongRequest !== '') {
                if (!GameLogic.pendingMahjongRequestCheck(gameboard, selectedCards, combination)) {
                    return;
                }
                requestedCard = gameboard.state.pendingMahjongRequest;
            }
            else if (gameboard.state.pendingBombToBePlayed) {
                if (!GameLogic.pendingBombCheck(gameboard, combination)) {
                    return;
                }
            }
            else if (gameboard.state.table.requestedCardName !== '') {
                if (!GameLogic.requestedCardCheck(gameboard, allPlayerCards, selectedCards, combination)) {
                    return;
                }
            }
            else {
                if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
                    window.alert("This combination cannot be played");
                    return;
                }
            }
            if (selectedCards[0].name === specialCards.DOGS) {
                nextPlayerIndex = (gameboard.state.currentPlayerIndex + 2) % 4;
                selectedCards = [];
                combination = null;
            }
            let requestObject: RequestedCardObject = { card: requestedCard };
            if (gameboard.state.pendingMahjongRequest === '') {
                GameLogic.attemptToSatisfyRequest(requestObject, selectedCards);
            }
            while (gameboard.state.playerHands[playerKeys[nextPlayerIndex]].length === 0) {
                nextPlayerIndex = (nextPlayerIndex + 1) % 4;
            }
            if (newState.gameRoundWinnerKey === '' && newState.playerHands[playerKey].length === 0) {
                newState.gameRoundWinnerKey = playerKey;
            }
            GameLogic.setAfterPlayState(gameboard, selectedCards, newState, combination,
                                        nextPlayerIndex, requestObject.card);
        }
        else {
            window.alert('Invalid card combination');
        }
    }

    /**
     * Creates the next card hands for all the players, provided that the current player
     * will play his selected cards, and filters these cards.
     * 
     * @param gameboard The Gameboard UI component.
     * @param newState The next Gameboard state where the next hands will be stored.
     * @param allCurrentPlayerCards All the current player cards will be stored here.
     * @param selectedCards The current player's **selected** cards will be stored here.
     * @param currentPlayerKey The key of the current player.
     */
    static filterNextPlayerHands(gameboard: GameboardComponent, newState: NewGameboardState,
                                 allCurrentPlayerCards: Array<CardInfo>, selectedCards: Array<CardInfo>,
                                 currentPlayerKey: string) {
        if (newState.playerHands === undefined) {
            newState.playerHands = {};
        }
        for (const key of playerKeys) {
            if (currentPlayerKey !== key) {
                newState.playerHands[key] = gameboard.state.playerHands[key];
            }
            else {
                newState.playerHands[currentPlayerKey] = [];
                for (const card of gameboard.state.playerHands[key]) {
                    if (card.isSelected) {
                        selectedCards.push(card);
                    }
                    else {
                        newState.playerHands[currentPlayerKey].push(card);
                    }
                    allCurrentPlayerCards.push(card);
                }
            }
        }
    }

    /**
     * Performs all the checks that are demanded when there is a pending Mahjong request.
     * Returns `true` if the checks are passed, `false` otherwise.
     * 
     * @param gameboard The Gameboard UI component.
     * @param selectedCards The current player's selected cards.
     * @param combination The combination to be played.
     */
    static pendingMahjongRequestCheck(gameboard: GameboardComponent, selectedCards: Array<CardInfo>,
                                      combination: CardCombination) {
        // If there is a pending mahjong request, the player must play the Mahjong
        if (!selectedCards.some(card => card.name === specialCards.MAHJONG)) {
            window.alert("The Mahjong must be played after a Mahjong request");
            return false;
        }
        if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
            window.alert("This combination cannot be played");
            return false;
        }
        return true;
    }

    /**
     * Performs all the checks that are demanded when there is a pending Bomb to be played.
     * Returns `true` if the checks are passed, `false` otherwise.
     * 
     * @param gameboard The Gameboard UI component.
     * @param combination The combination to be played.
     */
    static pendingBombCheck(gameboard: GameboardComponent, combination: CardCombination) {
        if (combination instanceof Bomb) {
            const tableCombination = gameboard.state.table.combination;
            if ( tableCombination !== null && 
                 tableCombination instanceof Bomb) {
                if (Bomb.compareBombs(tableCombination, combination) >= 0) {
                    window.alert("The selected combination cannot be played");
                    return false;
                }
            }
        }
        else {
            window.alert("A bomb must be played");
            return false;
        }
        return true;
    }

    /**
     * Performs all the checks that are demanded when there is an unsatisfied Mahjong request.
     * Returns `true` if the checks are passed, `false` otherwise.
     * 
     * @param gameboard The Gameboard UI component.
     * @param allPlayerCards All the current player's cards.
     * @param selectedCards The current player's selected cards.
     * @param combination The combination which is created by the selected cards.
     */
    static requestedCardCheck(gameboard: GameboardComponent, allPlayerCards: Array<CardInfo>,
                              selectedCards: Array<CardInfo>, combination: CardCombination) {
        if ( !GameLogic.isMahjongCompliant(gameboard.state.table.requestedCardName,
            gameboard.state.table.combination, allPlayerCards, combination, selectedCards)) {
           window.alert("A combination which contains the requested card is required.");
           return false;
       }
       if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
           window.alert("This combination cannot be played");
           return false;
       }
       return true;
    }

    /**
     * Sets the new Gameboard state, where a player has just played his cards.
     * 
     * @param gameboard The Gameboard UI component.
     * @param selectedCards The cards that are being played.
     * @param newState The next Gameboard state, which already has some properties set.
     * @param combination The combination that is being played.
     * @param nextPlayerIndex The players' array index of the next player.
     * @param requestedCard The Mahjong requested card (after the cards have been played).
     */
    static setAfterPlayState(gameboard: GameboardComponent, selectedCards: Array<CardInfo>,
                             newState: NewGameboardState, combination: CardCombination | null,
                             nextPlayerIndex: number, requestedCard: string) {
        newState.table = {
            previousCards: gameboard.state.table.previousCards.concat(gameboard.state.table.currentCards),
            currentCards: selectedCards,
            combination: combination,
            currentCardsOwnerIndex: gameboard.state.currentPlayerIndex,
            requestedCardName: requestedCard
        }
        newState.currentPlayerIndex = nextPlayerIndex;
        newState.pendingDragonToBeGiven = false;
        newState.pendingBombToBePlayed = false;
        newState.pendingMahjongRequest = '';
        gameboard.setState(newState);
    }

    /**
     * Called when the current player has chosen to pass.
     * 
     * If this is acceptable, the Gameboard state will be changed (it will be the next player's turn,
     * and if the next player is the owner of the currently on-table cards, the round will end).
     * Otherwise, an alert message will be displayed, and the current player will be forced to play.
     */
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

    /**
     * If the current game round can end normally, sets the new Gameboard component state accordingly,
     * or invokes a 
     * 
     * The currently on-table cards are handed to their owner (unless the Dragon is the top card,
     * where the owner has to choose an active opponent to hand the cards to).
     * @param newState 
     * @param cardsOwnerIndex The players' array index of the on-table cards owner.
     */
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

    /**
     * Forces the on-table cards owner to choose an active opponent to hand the table cards to,
     * by setting the Gameboard component state accordingly.
     * @param cardsOwnerIndex The players' array index of the on-table cards owner.
     */
    static giveDragon(gameboard: GameboardComponent, cardsOwnerIndex: number) {
        gameboard.setState({
            currentPlayerIndex: cardsOwnerIndex,
            pendingDragonToBeGiven: true
        });
    }

    /**
     * Called when the on table cards owner has chosen an active opponent
     * to hand the table cards to.
     * 
     * The on-table cards are given to the selected player, and a new game round begins
     * after the Gameboard component state has been properly set.
     * @param selectedPlayerKey The key of the selected active opponent.
     */
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
                //console.log(newState.playerHeaps[playerKeys[i]]);
            }
        }
        newState.table = {
            previousCards: [],
            currentCards: [],
            currentCardsOwnerIndex: -1,
            requestedCardName: gameboard.state.table.requestedCardName,
            combination: null
        };
        gameboard.setState(newState);
    }

    /**
     * Hands the Deck cards to the players (in clock order).
     */
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

    /**
     * Performs the desired player card trades and sets the Gameboard
     * component state accordingly.
     */
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

    /**
     * Evaluates the possible UI actions for the given player and stores them in the `actions` object.
     * @param gameboard The gameboard UI component.
     * @param playerIndex The players' array index of the target player.
     * @param mahjongIsPlayable Indicates whether the Mahjong can be played.
     * @param actions The `PlayerPossibleActions` object to store the actions.
     */
    static getPlayerPossibleActions(gameboard: GameboardComponent, playerIndex: number,
                                    mahjongIsPlayable: boolean, actions: PlayerPossibleActions) {
        if (gameboard.state.playerHands[playerKeys[playerIndex]].length === 14 &&
            gameboard.state.playerBets[playerKeys[playerIndex]] === gameBets.NONE &&
            gameboard.state.gameRoundWinnerKey === '') {
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

    /**
     * Returns the total points of the specified cards.
     */
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
