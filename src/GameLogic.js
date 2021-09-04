import { BombInfo } from "./BombInfo";
import { specialCards } from "./CardInfo";
import { playerKeys } from "./components/Gameboard";
import { cardCombinations,
         CardCombination,
         SingleCard,
         CardCouple,
         Triplet,
         FullHouse,
         Steps,
         Kenta } from "./CardCombinations";

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

    static isPlayable(tableCards, selectedCards, message) {
        if (tableCards.length > 0) {
            // Check if playable
        }
        else {
            // Check if combination is valid
        }
        return true;
    }

    static playCards(gameboard, playerKey) {
        let normalCheck = true;
        let checkBomb = false;
        let selectedCards = [];
        let playerHands = {};
        let requestedCard = gameboard.state.table.requestedCardName;
        let nextPlayerIndex = (gameboard.state.currentPlayerIndex + 1) % 4;
        let message = {
            text: ''
        };
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
                }
            }
        }
        
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
        /* gameboard will be enabled in the future        
        else if (gameboard.state.table.requestedCardName !== '') {
            // TODO: If there is an active majong request, the player must play the requested
            // card if present AND playable
            debugger;
            return;
        }
        */
        // TODO: check 1) is combination valid 2) is it playable?
        else if (gameboard.state.pendingBombToBePlayed) {
            let playerBomb = BombInfo.createBomb(selectedCards)
            if ( playerBomb === null) {
                window.alert("A bomb must be played");
                return;
            }
            else {
                let tableBomb = BombInfo.createBomb(gameboard.state.table.currentCards);
                if (BombInfo.compareBombs(tableBomb, playerBomb) >= 0) {
                    window.alert("The selected combination cannot be played");
                    return;
                }
            }
            normalCheck = false;
        }
        else if (selectedCards.some(card => card.name === specialCards.DOGS)) {
            if (selectedCards.length !== 1) {
                window.alert('Invalid card combination');
                return;
            }
            normalCheck = false;
            nextPlayerIndex = (gameboard.state.currentPlayerIndex + 2) % 4;
            selectedCards = [];
        }
        if (normalCheck) {
            if ( !GameLogic.isPlayable(gameboard.state.table.currentCards,
                selectedCards, message) ) {
                    window.alert(message.text);
                    return;
            }
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
                currentCardsOwnerIndex: gameboard.state.currentPlayerIndex,
                requestedCardName: requestedCard
            }
        })
    }

    static passTurn(gameboard) {
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
                console.log('End round twice bug');
            }
        }
        newState.currentPlayerIndex = nextPlayerIndex;
        gameboard.setState(newState);
    }

    static endRound(gameboard, newState, cardsOwnerIndex) {
        // Preparing for new round
        if (gameboard.state.table.currentCards[0].name === specialCards.DRAGON) {
            // TODO: Call GameLogic method directly
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
