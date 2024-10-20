import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createSessionSocketURI } from "../API/coreAPI";
import { ServerEventType, zGameRoundStartedEvent, zPlayerJoinedEvent, zWaitingForJoinEvent } from "../game_logic/shared/ServerEvents";
import { createInitialGameState } from "../state_types/GameState";
import { PLAYER_KEYS, PlayerBet } from "../game_logic/shared/shared";
import { Scoreboard } from "./Scoreboard";

import styles from "../styles/Components.module.css"
import { AppContext, appContextInitState, AppContextState } from "../AppContext";
import { ClientEventType } from "../game_logic/shared/ClientEvents";
import { HiddenPlayerHand } from "./HiddenPlayerHand";
import { ControlledPlayerHand } from "./ControlledPlayerHand";

type GameSessionProps = {
    sessionId: string,
    playerNickname: string,
};

function logError(msg?: any, ...optionals: any[]) {
    console.error(msg, ...optionals);
    alert(`${msg}. See console.`);
}

function eventHandlerWrapper<SE>(
    validator: (e: any) => SE,
    eventHandler: (e: SE) => void,
) {
    return (event: any) => {
        let e;
        try {
            e = validator(event);
        } catch (error) {
            return logError('Validation Error', error);
        }
        try {
            eventHandler(e);
        } catch (error) {
            return logError('Error in event handler', error);
        }
    };
}

export const GameSession: React.FC<GameSessionProps> = (props) => {

    const [appContextState, setAppContextState] = useState(appContextInitState);
    const [connectingToSession, setConnectingToSession] = useState(true);

    useEffect(() => {
        setConnectingToSession(true);

        // Init socket, without auto connecting
        const socket =
        io(createSessionSocketURI(props.sessionId), {
            autoConnect: false,
        })
        // Register listeners
        .on('connect', () => {
            
        }).on(ServerEventType.WAITING_4_JOIN, eventHandlerWrapper(
            zWaitingForJoinEvent.parse, e => {
                setAppContextState(ctx => {
                    const thisIdx = PLAYER_KEYS.indexOf(e.playerKey);
                    const teammateIdx = (thisIdx + 2) % PLAYER_KEYS.length;
                    const leftOpIdx = (thisIdx + PLAYER_KEYS.length - 1) % PLAYER_KEYS.length;
                    const rightOpIdx = (thisIdx + 1) % PLAYER_KEYS.length;
                    const newCtx: AppContextState = {
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
                                    nickname: e.data.presentPlayers[PLAYER_KEYS[teammateIdx]] ?? '',
                                } : ctx.gameContext.teammate
                            ),
                            leftOpponent: (
                                e.data.presentPlayers[PLAYER_KEYS[leftOpIdx]] ? {
                                    playerKey: PLAYER_KEYS[leftOpIdx],
                                    playerIndex: leftOpIdx,
                                    nickname: e.data.presentPlayers[PLAYER_KEYS[leftOpIdx]] ?? '',
                                } : ctx.gameContext.leftOpponent
                            ),
                            rightOpponent: (
                                e.data.presentPlayers[PLAYER_KEYS[rightOpIdx]] ? {
                                    playerKey: PLAYER_KEYS[rightOpIdx],
                                    playerIndex: rightOpIdx,
                                    nickname: e.data.presentPlayers[PLAYER_KEYS[rightOpIdx]] ?? '',
                                } : ctx.gameContext.rightOpponent
                            ),
                        }
                    };
                    return newCtx;
                });

                socket.emit(
                    ClientEventType.JOIN_GAME, {
                        data: {
                            playerNickname: props.playerNickname,
                        },
                        eventType: ClientEventType.JOIN_GAME,
                    }
                );
            }
        )).on(ServerEventType.PLAYER_JOINED, eventHandlerWrapper(
            zPlayerJoinedEvent.parse, e => {
                setAppContextState(ctx => {
                    const thisIdx = ctx.gameContext.thisPlayer?.playerIndex;
                    if (thisIdx === undefined) {
                        throw new Error('Another player joined before client player index received.');
                    }
                    const teammateIdx = (thisIdx + 2) % PLAYER_KEYS.length;
                    const leftOpIdx = (thisIdx + PLAYER_KEYS.length - 1) % PLAYER_KEYS.length;
                    const rightOpIdx = (thisIdx + 1) % PLAYER_KEYS.length;
                    const newCtx: AppContextState = {
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
                    return newCtx;
                });
            }
        )).on(ServerEventType.GAME_ROUND_STARTED, eventHandlerWrapper(
            zGameRoundStartedEvent.parse, e => {
                setAppContextState(ctx => {
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
                })
            }
        ))

        setAppContextState(ctx => ({
            ...ctx,
            socket: socket,
        }));

        // Connect after listeners registered
        socket.connect();

        // On unmount, cleanup
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        }
    }, [props.sessionId, props.playerNickname]);

    useEffect(() => {
        if (appContextState.gameContext.thisPlayer?.playerKey) {
            setConnectingToSession(false);
        }
    }, [appContextState.gameContext.thisPlayer?.playerKey])

    return (
        <AppContext.Provider 
			value={{
				state: appContextState,
				setState: setAppContextState,
			}}
		>{
            connectingToSession ?
            <div>
                Connecting to session...
            </div>
            :
            <div className={styles.gameContainer}>
                <Scoreboard
                    scores={appContextState.gameContext.previousGames}
                    current={{
                        team02: appContextState.gameContext.previousGames.reduce(
                            (sum, { team02 }) => sum + team02, 0
                        ),
                        team13: appContextState.gameContext.previousGames.reduce(
                            (sum, { team13 }) => sum + team13, 0
                        )
                    }}
                />
                <div className={styles.gameboardStyle}>
                    <HiddenPlayerHand
                        playerKey={appContextState.gameContext.teammate?.playerKey}
                        style={styles.teammate}
                    />
                    <HiddenPlayerHand
                        playerKey={appContextState.gameContext.leftOpponent?.playerKey}
                        style={styles.leftOpponent}
                    />
                    <div className={styles.tableStyle}>
                        
                    </div>
                    <HiddenPlayerHand
                        playerKey={appContextState.gameContext.rightOpponent?.playerKey}
                        style={styles.rightOpponent}
                    />
                    <ControlledPlayerHand/>
            </div>
            </div>
        }</AppContext.Provider>
    );
}
