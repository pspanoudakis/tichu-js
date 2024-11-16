import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createSessionSocketURI } from "../API/coreAPI";
import {
    ServerEventType,
    zBetPlacedEvent,
    zGameEndedEvent,
    zGameStartedEvent,
    zPlayerJoinedEvent,
    zPlayerLeftEvent,
    zWaitingForJoinEvent
} from "../game_logic/shared/ServerEvents";
import { Scoreboard } from "./Scoreboard";

import styles from "../styles/Components.module.css";
import {
    AppContext,
    appContextInitState,
    handleBetPlacedEvent,
    handleGameEndedEvent,
    handleGameStartedEvent,
    handlePlayerJoinedEvent,
    handlePlayerLeftEvent,
    handleWaitingForJoinEvent
} from "../AppContext";
import { ClientEventType } from "../game_logic/shared/ClientEvents";
import {
    errorEventListeners,
    eventHandlerWrapper,
    registerEventListenersHelper
} from "../utils/eventUtils";
import { GameRound } from "./GameRound";

type GameSessionProps = {
    sessionId: string,
    playerNickname: string,
};

export const GameSession: React.FC<GameSessionProps> = (props) => {

    const [appContextState, setAppContextState] = useState(appContextInitState);
    const [connectingToSession, setConnectingToSession] = useState(true);

    useEffect(() => {
        setConnectingToSession(true);

        // Init socket, without auto connecting
        const socket = io(createSessionSocketURI(props.sessionId), {
            autoConnect: false,
        });

        // Register event listeners
        const cleanupListeners = registerEventListenersHelper({
            connect: () => {
                console.log(
                    `SocketIO connection established. Socket ID: ${socket.id}`
                );
            },
            [ServerEventType.WAITING_4_JOIN]: eventHandlerWrapper(
                zWaitingForJoinEvent.parse, e => {
                    setAppContextState(s => handleWaitingForJoinEvent(s, e));
                    socket.emit(
                        ClientEventType.JOIN_GAME, {
                            data: {
                                playerNickname: props.playerNickname,
                            },
                            eventType: ClientEventType.JOIN_GAME,
                        }
                    );
                }
            ),
            [ServerEventType.PLAYER_JOINED]: eventHandlerWrapper(
                zPlayerJoinedEvent.parse, e => {
                    setAppContextState(s => handlePlayerJoinedEvent(s, e));
                }
            ),
            [ServerEventType.BET_PLACED]: eventHandlerWrapper(
                zBetPlacedEvent.parse, e => {
                    setAppContextState(s => handleBetPlacedEvent(s, e));
                }
            ),
            [ServerEventType.GAME_STARTED]: eventHandlerWrapper(
                zGameStartedEvent.parse, e => {
                    setAppContextState(s => handleGameStartedEvent(s, e));
                }                
            ),
            [ServerEventType.GAME_ENDED]: eventHandlerWrapper(
                zGameEndedEvent.parse, e => {
                    setAppContextState(s => handleGameEndedEvent(s, e));
                }                
            ),
            [ServerEventType.PLAYER_LEFT]: eventHandlerWrapper(
                zPlayerLeftEvent.parse, e => {
                    if(e.data.gameOver) alert(`A player has left the game.`);
                    setAppContextState(s => handlePlayerLeftEvent(s, e));
                }                
            ),
            ...errorEventListeners,
        }, socket);

        setAppContextState(s => ({
            ...s,
            socket: socket,
        }));

        // Connect after listeners registered
        socket.connect();

        // On unmount, cleanup
        return () => {
            cleanupListeners();
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
                <GameRound/>
            </div>
        }</AppContext.Provider>
    );
}
