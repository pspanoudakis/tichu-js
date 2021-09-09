import {specialCards} from "./CardInfo";
import {playerKeys} from "./components/Gameboard";
import {cardCombinations,
        SingleCard,
        CardCouple,
        Triplet,
        FullHouse,
        Steps,
        Kenta,
        Bomb} from "./CardCombinations";

export class GameLogic {

    static mustEndGame(gameboard) {
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

    static majongIsPlayable(gameboard) {
        return gameboard.state.table.currentCards.length === 0 || 
        gameboard.state.table.currentCards[0].name === specialCards.PHOENIX;
    }

    static isPlayable(tableCombination, selectedCombination) {
        if (tableCombination !== undefined) {
            if (selectedCombination.combination === cardCombinations.BOMB) {
                if (tableCombination.combination === cardCombinations.BOMB) {
                    return Bomb.compareBombs(selectedCombination, tableCombination) > 0;
                }
                return true;
            }
            if (selectedCombination.combination === tableCombination.combination) {
                return tableCombination.compare(selectedCombination) < 0;
            }
            return false;
        }
        return true;
    }

    static canPassTurn(tableCombination, requestedCard, playerCards) {
        if (requestedCard === "") { return true; }
        if (tableCombination !== undefined) {
            switch(tableCombination.combination) {
                case cardCombinations.BOMB:
                    // TODO: decide behaviour here
                    return true;
                case cardCombinations.SINGLE:
                    if (tableCombination.compare(
                        SingleCard.getStrongestRequested(playerCards, requestedCard) ) < 0) {
                            return false;
                    }
                    break;
                case cardCombinations.COUPLE:
                    if (tableCombination.compare(
                        CardCouple.getStrongestRequested(playerCards, requestedCard) ) < 0) {
                            return false;
                    }
                    break;
                case cardCombinations.TRIPLET:
                    if (tableCombination.compare(
                        Triplet.getStrongestRequested(playerCards, requestedCard) ) < 0) {
                            return false;
                    }
                    break;
                case cardCombinations.FULLHOUSE:
                    if (tableCombination.compare(
                        FullHouse.getStrongestRequested(playerCards, requestedCard) ) < 0) {
                            return false;
                    }
                    break;
                case cardCombinations.STEPS:
                    if (tableCombination.compare(
                        Steps.getStrongestRequested(playerCards, requestedCard,
                        tableCombination.length) ) < 0) {
                            return false;
                    }
                    break;
                case cardCombinations.KENTA:
                    if (tableCombination.compare(
                        Kenta.getStrongestRequested(playerCards, requestedCard,
                        tableCombination.length) ) < 0) {
                            return false;
                    }
                    break;
                default:
                    return false;
            }
            return Bomb.getStrongestRequested(playerCards, requestedCard) === null;
        }
        else {
            return false;
        }
    }

    static createCombination(cards, tableCards) {
        let combination = null;
        switch (cards.length) {
            case 1:
                if (cards[0].name === specialCards.PHOENIX) {
                    if (tableCards.length > 0 && tableCards[0].name !== specialCards.DRAGON) {
                        cards[0].tempValue = tableCards[0].value + 0.5;                        
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

    static isMajongCompliant(requestedCard, tableCombination, allCards, combination, selectedCards) {
        if (combination.combination === cardCombinations.BOMB) { return true; }
        if (tableCombination === undefined) {
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
                    if (tableCombination.compare(
                        SingleCard.getStrongestRequested(allCards, requestedCard) ) < 0) {
                            if ( !selectedCards.some(card => card.name === requestedCard)) {
                                return false;
                            }
                    }
                    break;
                case cardCombinations.COUPLE:
                    if (tableCombination.compare(
                        CardCouple.getStrongestRequested(allCards, requestedCard) ) < 0) {
                            if ( !selectedCards.some(card => card.name === requestedCard)) {
                                return false;
                            }
                    }
                    break;
                case cardCombinations.TRIPLET:
                    if (tableCombination.compare(
                        Triplet.getStrongestRequested(allCards, requestedCard) ) < 0) {
                            if ( !selectedCards.some(card => card.name === requestedCard)) {
                                return false;
                            }
                    }
                    break;
                case cardCombinations.FULLHOUSE:
                    if (tableCombination.compare(
                        FullHouse.getStrongestRequested(allCards, requestedCard) ) < 0) {
                            if ( !selectedCards.some(card => card.name === requestedCard)) {
                                return false;
                            }
                    }
                    break;
                case cardCombinations.STEPS:
                    if (tableCombination.compare(
                        Steps.getStrongestRequested(allCards, requestedCard,
                        tableCombination.length) ) < 0) {
                            if ( !selectedCards.some(card => card.name === requestedCard)) {
                                return false;
                            }
                    }
                    break;
                case cardCombinations.KENTA:
                    if (tableCombination.compare(
                        Kenta.getStrongestRequested(allCards, requestedCard,
                        tableCombination.length) ) < 0) {
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

    static satisfyRequestIfPossible(requestObject, selectedCards) {
        if (requestObject.card !== "") {
            if (selectedCards.some(card => card.name === requestObject.card)) {
                requestObject.card = "";
            }
        }
    }

    static playCards(gameboard, playerKey) {
        let normalCheck = true;
        let selectedCards = [];
        let allPlayerCards = [];
        let playerHands = {};
        let requestedCard = gameboard.state.table.requestedCardName;
        let nextPlayerIndex = (gameboard.state.currentPlayerIndex + 1) % 4;
        for (const key of playerKeys) {
            if (playerKey !== key) {
                playerHands[key] = gameboard.state.playerHands[key];
            }
            else {
                playerHands[playerKey] = [];
                for (const card of gameboard.state.playerHands[key]) {
                    if (card.isSelected) {
                        selectedCards.push(card);
                    }
                    else {
                        playerHands[playerKey].push(card);
                    }
                    allPlayerCards.push(card);
                }
            }
        }
        let combination = GameLogic.createCombination(selectedCards, gameboard.state.table.currentCards);
        if (combination !== null) {
            if (gameboard.state.pendingMajongRequest !== '') {
                // If there is a pending majong request, the player must play the Majong
                if (!selectedCards.some(card => card.name === specialCards.MAJONG)) {
                    window.alert("The Majong must be played after a Majong request");
                    return;
                }
                else {
                    requestedCard = gameboard.state.pendingMajongRequest;
                }
            }
            else if (gameboard.state.pendingBombToBePlayed) {
                if (combination.combination !== cardCombinations.BOMB) {
                    window.alert("A bomb must be played");
                    return;
                }
                else {
                    const tableCombination = gameboard.state.table.combination;
                    if ( tableCombination !== undefined && 
                         tableCombination.combination === cardCombinations.BOMB) {
                        if (Bomb.compareBombs(tableCombination, combination) >= 0) {
                            window.alert("The selected combination cannot be played");
                            return;
                        }
                    }
                    
                }
                normalCheck = false;
            }
            else if (gameboard.state.table.requestedCardName !== '') {
                if ( !GameLogic.isMajongCompliant(gameboard.state.table.requestedCardName,
                     gameboard.state.table.combination, allPlayerCards, combination, selectedCards)) {
                    window.alert("A combination which contains the requested card is required.");
                    return;
                }
            }
            else if (selectedCards.some(card => card.name === specialCards.DOGS)) {
                if (gameboard.state.table.combination !== undefined) {
                    window.alert("Dogs cannot be played on top of other cards.");
                    return;
                }
                normalCheck = false;
                nextPlayerIndex = (gameboard.state.currentPlayerIndex + 2) % 4;
                selectedCards = [];
                combination = undefined;
            }
            if (normalCheck) {
                if ( !GameLogic.isPlayable(gameboard.state.table.combination, combination) ) {
                    window.alert("This combination cannot be played");
                    return;
                }
            }
            let requestObject = { card: requestedCard };
            if (gameboard.state.pendingMajongRequest === '') {
                GameLogic.satisfyRequestIfPossible(requestObject, selectedCards);
            }
            while (gameboard.state.playerHands[playerKeys[nextPlayerIndex]].length === 0) {
                nextPlayerIndex = (nextPlayerIndex + 1) % 4;
            }
            gameboard.setState({
                playerHands: playerHands,
                currentPlayerIndex: nextPlayerIndex,
                pendingMajongRequest: '',
                pendingDragonToBeGiven: false,
                pendingBombToBePlayed: false,
                table: {
                    previousCards: gameboard.state.table.previousCards.concat(gameboard.state.table.currentCards),
                    currentCards: selectedCards,
                    combination: combination,
                    currentCardsOwnerIndex: gameboard.state.currentPlayerIndex,
                    requestedCardName: requestObject.card
                }
            });
        }
        else {
            window.alert('Invalid card combination');
        }
    }

    static passTurn(gameboard) {
        const currentPlayerKey = playerKeys[gameboard.state.currentPlayerIndex];
        const currentPlayerHand = gameboard.state.playerHands[currentPlayerKey];
        if (GameLogic.canPassTurn(gameboard.state.table.combination,
            gameboard.state.table.requestedCardName, currentPlayerHand)) {
            let nextPlayerIndex = (gameboard.state.currentPlayerIndex + 1) % 4;
            let newState = {};
            let endedRound = false;
            while (gameboard.state.playerHands[playerKeys[nextPlayerIndex]].length === 0) {
                if (nextPlayerIndex === gameboard.state.table.currentCardsOwnerIndex) {
                    GameLogic.endRound(gameboard, newState, nextPlayerIndex);
                    endedRound = true;
                }
                nextPlayerIndex = (nextPlayerIndex + 1) % 4;
            }
            if (nextPlayerIndex === gameboard.state.table.currentCardsOwnerIndex) {
                GameLogic.endRound(gameboard, newState, nextPlayerIndex);
                if (endedRound) {
                    window.alert('End round twice bug');
                }
            }
            newState.currentPlayerIndex = nextPlayerIndex;
            gameboard.setState(newState);
        }
        else {
            window.alert("A combination which contains the requested card is required.");
        }        
    }

    static endRound(gameboard, newState, cardsOwnerIndex) {
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
                newState.table = {};
                newState.table.previousCards = [];
                newState.table.currentCards = [];
                newState.table.combination = undefined;
                newState.table.currentCardsOwnerIndex = -1;
                newState.table.requestedCardName = gameboard.state.table.requestedCardName;
                console.log(newState.playerHeaps[playerKeys[i]]);
            }
        }
    }

    static giveDragon(gameboard, cardsOwnerIndex) {
        gameboard.setState({
            currentPlayerIndex: cardsOwnerIndex,
            pendingDragonToBeGiven: true
        });
    }

    static dragonGiven(gameboard, selectedPlayerKey) {
        // New current player is already set
        let newState = {
            pendingDragonToBeGiven: false
        }
        newState.playerHeaps = {}
        for (let i = 0; i < playerKeys.length; i++) {
            newState.playerHeaps[playerKeys[i]] = gameboard.state.playerHeaps[playerKeys[i]];
            if (playerKeys[i] === selectedPlayerKey) {
                newState.playerHeaps[playerKeys[i]].push(...gameboard.state.table.previousCards);
                newState.playerHeaps[playerKeys[i]].push(...gameboard.state.table.currentCards);
                newState.table = {};
                newState.table.previousCards = [];
                newState.table.currentCards = [];
                newState.table.currentCardsOwnerIndex = -1;
                newState.table.requestedCardName = gameboard.state.table.requestedCardName;
                console.log(newState.playerHeaps[playerKeys[i]]);
            }
        }
        gameboard.setState(newState);
    }

    static handCards(gameboard) {
        let playerHands = {};
        for (const key of playerKeys) {
            playerHands[key] = [];
        }

        let i = 0, card, majongOwnerIndex;
        while ((card = gameboard.state.deck.cards.pop()) !== undefined) {
            if (card.key === specialCards.MAJONG) {
                majongOwnerIndex = i;
            }
            playerHands[playerKeys[i++]].push(card)
            i %= playerKeys.length;
        }

        gameboard.setState({
            gameHasStarted: true,
            playerHands: playerHands,
            currentPlayerIndex: majongOwnerIndex
        });
    }
}
