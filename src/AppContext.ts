import { createContext } from 'react'
import { createInitialGameState, GameState } from './state_types/GameState'
import { Socket } from 'socket.io-client'

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
