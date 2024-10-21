import { createContext } from 'react'
import { createInitialGameState, GameState } from './state_types/GameState'
import { Socket } from 'socket.io-client'
import { GameRoundStartedEvent, PlayerJoinedEvent, WaitingForJoinEvent } from './game_logic/shared/ServerEvents';
import { PLAYER_KEYS, PlayerBet } from './game_logic/shared/shared';

export type AppContextState = {
    gameContext: GameState,
    socket?: Socket,
};

export type AppContextType = {
    state: AppContextState,
    setState?: (f: ((prevState: AppContextState) => AppContextState)) => void
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
    ctx: AppContextState, e: WaitingForJoinEvent
): AppContextState {
    const thisIdx = PLAYER_KEYS.indexOf(e.playerKey);
    const teammateIdx = getTeammateIdx(thisIdx);
    const leftOpIdx = getLeftOpponentIdx(thisIdx);
    const rightOpIdx = getRightOpponentIdx(thisIdx);
    return {
        ...ctx,
        gameContext: {
            ...ctx.gameContext,
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
                } : ctx.gameContext.teammate
            ),
            leftOpponent: (
                e.data.presentPlayers[PLAYER_KEYS[leftOpIdx]] ? {
                    playerKey: PLAYER_KEYS[leftOpIdx],
                    playerIndex: leftOpIdx,
                    nickname: e.data.presentPlayers[
                        PLAYER_KEYS[leftOpIdx]
                    ] ?? '',
                } : ctx.gameContext.leftOpponent
            ),
            rightOpponent: (
                e.data.presentPlayers[PLAYER_KEYS[rightOpIdx]] ? {
                    playerKey: PLAYER_KEYS[rightOpIdx],
                    playerIndex: rightOpIdx,
                    nickname: e.data.presentPlayers[
                        PLAYER_KEYS[rightOpIdx]
                    ] ?? '',
                } : ctx.gameContext.rightOpponent
            ),
        }
    };
}

export function handlePlayerJoinedEvent(
    ctx: AppContextState, e: PlayerJoinedEvent
): AppContextState {
    const thisIdx = ctx.gameContext.thisPlayer?.playerIndex;
    if (thisIdx === undefined) {
        throw new Error('Another player joined before client player index received.');
    }
    const teammateIdx = getTeammateIdx(thisIdx);
    const leftOpIdx = getLeftOpponentIdx(thisIdx);
    const rightOpIdx = getRightOpponentIdx(thisIdx);
    return {
        ...ctx,
        gameContext: {
            ...ctx.gameContext,
            thisPlayer: e.playerKey === PLAYER_KEYS[thisIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : ctx.gameContext.thisPlayer,
            leftOpponent: e.playerKey === PLAYER_KEYS[leftOpIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : ctx.gameContext.leftOpponent,
            rightOpponent: e.playerKey === PLAYER_KEYS[rightOpIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : ctx.gameContext.rightOpponent,
            teammate: e.playerKey === PLAYER_KEYS[teammateIdx] ? {
                playerKey: e.playerKey,
                playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                nickname: e.data.playerNickname,
            } : ctx.gameContext.teammate,
        }
    }
}

export function handleGameRoundStartedEvent(
    ctx: AppContextState, e: GameRoundStartedEvent
): AppContextState {
    if (
        !ctx.gameContext.thisPlayer ||
        !ctx.gameContext.leftOpponent ||
        !ctx.gameContext.rightOpponent ||
        !ctx.gameContext.teammate
    ) {
        console.error(`Player state not initialized: `, ctx.gameContext);
        throw new Error(`Player state not initialized.`);
    }
    return {
        ...ctx,
        gameContext: {
            ...ctx.gameContext,
            currentRoundState: {
                thisPlayer: {
                    cardKeys: e.data.partialCards,
                    pendingBomb: false,
                    playerBet: PlayerBet.NONE,
                    playerKey: ctx.gameContext.thisPlayer.playerKey,
                },
                tableState: {
                    pendingDragonSelection: false,
                    currentCardKeys: [],
                },
                leftOpponent: {
                    numberOfCards: e.data.partialCards.length,
                    pendingBomb: false,
                    playerBet: PlayerBet.NONE,
                    playerKey: ctx.gameContext.leftOpponent.playerKey,
                },
                rightOpponent: {
                    numberOfCards: e.data.partialCards.length,
                    pendingBomb: false,
                    playerBet: PlayerBet.NONE,
                    playerKey: ctx.gameContext.rightOpponent.playerKey,
                },
                teammate: {
                    numberOfCards: e.data.partialCards.length,
                    pendingBomb: false,
                    playerBet: PlayerBet.NONE,
                    playerKey: ctx.gameContext.teammate.playerKey,
                },
            }
        }
    }
}
