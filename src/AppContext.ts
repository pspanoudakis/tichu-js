import { createContext } from 'react'
import { createInitialGameState, GameState } from './state_types/GameState'
import { Socket } from 'socket.io-client'
import {
    AllCardsRevealedEvent,
    BetPlacedEvent,
    BombDroppedEvent,
    CardsPlayedEvent,
    CardsTradedEvent,
    GameRoundStartedEvent,
    PlayerJoinedEvent,
    TableRoundStartedEvent,
    TurnPassedEvent,
    WaitingForJoinEvent
} from './game_logic/shared/ServerEvents';
import { PLAYER_KEYS, PlayerBet } from './game_logic/shared/shared';
import { TradeDecisions } from './game_logic/TradeDecisions';

export type AppContextState = {
    gameContext: GameState,
    socket?: Socket,
};

export type AppContextStateSetter =
    (f: ((prevState: AppContextState) => AppContextState)) => void;

export type AppContextType = {
    state: AppContextState,
    setState?: AppContextStateSetter,
};

export const appContextInitState: AppContextState = {
    gameContext: createInitialGameState(),
};

export const AppContext = createContext<AppContextType>({
    state: appContextInitState,
    setState: undefined
});

export const setGameState = (ctx: AppContextType, newGameCtx: GameState) =>
    ctx.setState?.(ctxState => ({
        socket: ctxState.socket,
        gameContext: newGameCtx,
    }));

export const setSocket = (ctx: AppContextType, socket: Socket) =>
    ctx.setState?.(ctxState => ({
        gameContext: ctxState.gameContext,
        socket,
    }));

const getTeammateIdx =
    (playerIdx: number) => (playerIdx + 2) % PLAYER_KEYS.length;
const getLeftOpponentIdx =
    (playerIdx: number) => (playerIdx + PLAYER_KEYS.length - 1) % PLAYER_KEYS.length;
const getRightOpponentIdx =
    (playerIdx: number) => (playerIdx + 1) % PLAYER_KEYS.length;

export function handleWaitingForJoinEvent(
    s: AppContextState, e: WaitingForJoinEvent
): AppContextState {
    const thisIdx = PLAYER_KEYS.indexOf(e.playerKey);
    const teammateIdx = getTeammateIdx(thisIdx);
    const leftOpIdx = getLeftOpponentIdx(thisIdx);
    const rightOpIdx = getRightOpponentIdx(thisIdx);
    return {
        ...s,
        gameContext: {
            ...s.gameContext,
            thisPlayer: {
                playerKey: e.playerKey,
                playerIndex: thisIdx,
                nickname: '',
            },
            teammate: (
                e.data.presentPlayers[PLAYER_KEYS[teammateIdx]] ? {
                    playerKey: PLAYER_KEYS[teammateIdx],
                    playerIndex: teammateIdx,
                    nickname: e.data.presentPlayers[
                        PLAYER_KEYS[teammateIdx]
                    ] ?? '',
                } : s.gameContext.teammate
            ),
            leftOpponent: (
                e.data.presentPlayers[PLAYER_KEYS[leftOpIdx]] ? {
                    playerKey: PLAYER_KEYS[leftOpIdx],
                    playerIndex: leftOpIdx,
                    nickname: e.data.presentPlayers[
                        PLAYER_KEYS[leftOpIdx]
                    ] ?? '',
                } : s.gameContext.leftOpponent
            ),
            rightOpponent: (
                e.data.presentPlayers[PLAYER_KEYS[rightOpIdx]] ? {
                    playerKey: PLAYER_KEYS[rightOpIdx],
                    playerIndex: rightOpIdx,
                    nickname: e.data.presentPlayers[
                        PLAYER_KEYS[rightOpIdx]
                    ] ?? '',
                } : s.gameContext.rightOpponent
            ),
        }
    };
}

export function handlePlayerJoinedEvent(
    s: AppContextState, e: PlayerJoinedEvent
): AppContextState {
    const thisIdx = s.gameContext.thisPlayer?.playerIndex;
    if (thisIdx === undefined) {
        throw new Error('Another player joined before client player index received.');
    }
    const teammateIdx = getTeammateIdx(thisIdx);
    const leftOpIdx = getLeftOpponentIdx(thisIdx);
    const rightOpIdx = getRightOpponentIdx(thisIdx);
    return {
        ...s,
        gameContext: {
            ...s.gameContext,
            thisPlayer: e.playerKey === PLAYER_KEYS[thisIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : s.gameContext.thisPlayer,
            leftOpponent: e.playerKey === PLAYER_KEYS[leftOpIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : s.gameContext.leftOpponent,
            rightOpponent: e.playerKey === PLAYER_KEYS[rightOpIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : s.gameContext.rightOpponent,
            teammate: e.playerKey === PLAYER_KEYS[teammateIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : s.gameContext.teammate,
        }
    };
}

export function handleGameRoundStartedEvent(
    e: GameRoundStartedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (
            !s.gameContext.thisPlayer ||
            !s.gameContext.leftOpponent ||
            !s.gameContext.rightOpponent ||
            !s.gameContext.teammate
        ) {
            console.error(`Player state not initialized: `, s.gameContext);
            throw new Error(`Player state not initialized.`);
        }
        return ({
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    thisPlayer: {
                        cardKeys: e.data.partialCards,
                        pendingBomb: false,
                        playerBet: PlayerBet.NONE,
                        playerKey: s.gameContext.thisPlayer.playerKey,
                    },
                    tableState: {
                        pendingDragonSelection: false,
                        currentCardKeys: [],
                        pendingBomb: false,
                    },
                    leftOpponent: {
                        numberOfCards: e.data.partialCards.length,
                        pendingBomb: false,
                        playerBet: PlayerBet.NONE,
                        playerKey: s.gameContext.leftOpponent.playerKey,
                    },
                    rightOpponent: {
                        numberOfCards: e.data.partialCards.length,
                        pendingBomb: false,
                        playerBet: PlayerBet.NONE,
                        playerKey: s.gameContext.rightOpponent.playerKey,
                    },
                    teammate: {
                        numberOfCards: e.data.partialCards.length,
                        pendingBomb: false,
                        playerBet: PlayerBet.NONE,
                        playerKey: s.gameContext.teammate.playerKey,
                    },
                }
            }
        })
    });
}

export function handleAllCardsRevealedEvent(
    e: AllCardsRevealedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    thisPlayer: {
                        ...s.gameContext.currentRoundState.thisPlayer,
                        cardKeys: e.data.cards,
                    },
                    
                }
            }
        }
    });
}

export function addIncomingTradedCards(
    e: CardsTradedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    thisPlayer: {
                        ...s.gameContext.currentRoundState.thisPlayer,
                        cardKeys: [
                            ...s.gameContext.currentRoundState.thisPlayer.cardKeys,
                            e.data.cardByLeft,
                            e.data.cardByRight,
                            e.data.cardByTeammate,
                        ],
                    },
                    
                }
            }
        }
    })
}

export function removeOutcomingTradedCards(
    td: TradeDecisions,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    thisPlayer: {
                        ...s.gameContext.currentRoundState.thisPlayer,
                        cardKeys: [
                            ...s.gameContext.currentRoundState.thisPlayer.cardKeys
                                .filter(key =>
                                    !Object.values(td).some(c => c.key === key)
                                )
                        ],
                    },
                    
                }
            }
        }
    })
}

export function handleTableRoundStartedEvent(
    e: TableRoundStartedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        const numCards = s.gameContext.currentRoundState.thisPlayer.cardKeys.length;
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    playerInTurnKey: e.data.currentPlayer,
                    leftOpponent: {
                        ...s.gameContext.currentRoundState.leftOpponent,
                        numberOfCards: numCards,
                    },
                    rightOpponent: {
                        ...s.gameContext.currentRoundState.rightOpponent,
                        numberOfCards: numCards,
                    },
                    teammate: {
                        ...s.gameContext.currentRoundState.teammate,
                        numberOfCards: numCards,
                    },
                }
            }
        }
    });
}

export function handleBetPlacedEvent(
    s: AppContextState, e: BetPlacedEvent
): AppContextState {
    if (!s.gameContext.currentRoundState) {
        console.error(
            `Round state not initialized: `,
            s.gameContext.thisPlayer
        );
        throw new Error();
    }
    const targetPlayerIdx = PLAYER_KEYS.indexOf(e.playerKey)
    return {
        ...s,
        gameContext: {
            ...s.gameContext,
            currentRoundState: {
                ...s.gameContext.currentRoundState,
                thisPlayer: (
                    (targetPlayerIdx === s.gameContext.thisPlayer?.playerIndex) ?
                    {
                        ...s.gameContext.currentRoundState.thisPlayer,
                        playerBet: e.data.betPoints
                    } : s.gameContext.currentRoundState.thisPlayer
                ),
                teammate: (
                    (targetPlayerIdx === s.gameContext.teammate?.playerIndex) ?
                    {
                        ...s.gameContext.currentRoundState.teammate,
                        playerBet: e.data.betPoints
                    } : s.gameContext.currentRoundState.teammate
                ),
                leftOpponent: (
                    (targetPlayerIdx === s.gameContext.leftOpponent?.playerIndex) ?
                    {
                        ...s.gameContext.currentRoundState.leftOpponent,
                        playerBet: e.data.betPoints
                    } : s.gameContext.currentRoundState.leftOpponent
                ),
                rightOpponent: (
                    (targetPlayerIdx === s.gameContext.rightOpponent?.playerIndex) ?
                    {
                        ...s.gameContext.currentRoundState.rightOpponent,
                        playerBet: e.data.betPoints
                    } : s.gameContext.currentRoundState.rightOpponent
                ),
            }
        }
    };
}

export function handleCardsPlayedEvent(
    e: CardsPlayedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        const thisPlayer = s.gameContext.currentRoundState.thisPlayer;
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    playerInTurnKey: e.data.currentPlayer,
                    tableState: {
                        ...s.gameContext.currentRoundState.tableState,
                        combinationType: e.data.combinationType,
                        currentCardKeys: e.data.tableCardKeys
                    },
                    thisPlayer: (
                        (e.playerKey === s.gameContext.thisPlayer?.playerKey) ?
                        {
                            ...thisPlayer,
                            cardKeys: thisPlayer.cardKeys.filter(
                                ck => !e.data.tableCardKeys.includes(ck)
                            ),
                        } : thisPlayer
                    ),
                    teammate: (
                        (e.playerKey === s.gameContext.teammate?.playerKey) ?
                        {
                            ...s.gameContext.currentRoundState.teammate,
                            numberOfCards: e.data.numCardsRemainingInHand,
                        } : s.gameContext.currentRoundState.teammate
                    ),
                    leftOpponent: (
                        (e.playerKey === s.gameContext.leftOpponent?.playerKey) ?
                        {
                            ...s.gameContext.currentRoundState.leftOpponent,
                            numberOfCards: e.data.numCardsRemainingInHand,
                        } : s.gameContext.currentRoundState.leftOpponent
                    ),
                    rightOpponent: (
                        (e.playerKey === s.gameContext.rightOpponent?.playerKey) ?
                        {
                            ...s.gameContext.currentRoundState.rightOpponent,
                            numberOfCards: e.data.numCardsRemainingInHand,
                        } : s.gameContext.currentRoundState.rightOpponent
                    ),
                }
            }
        }
    });
}

export function handleTurnPassedEvent(
    e: TurnPassedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    playerInTurnKey: e.data.currentPlayer,
                }
            }
        }
    });
}

export function handleBombDroppedEvent(
    e: BombDroppedEvent,
    setCtxState?: AppContextStateSetter,
) {
    setCtxState?.(s => {
        if (!s.gameContext.currentRoundState) {
            console.error(
                `Round state not initialized: `,
                s.gameContext.thisPlayer
            );
            throw new Error();
        }
        return {
            ...s,
            gameContext: {
                ...s.gameContext,
                currentRoundState: {
                    ...s.gameContext.currentRoundState,
                    playerInTurnKey: e.playerKey,
                    tableState: {
                        ...s.gameContext.currentRoundState.tableState,
                        pendingBomb: true,
                    }
                }
            }
        }
    });
}
