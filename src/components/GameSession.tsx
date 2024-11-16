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
import { DisconnectDescription, Socket } from "socket.io-client/build/esm/socket";

type GameSessionProps = {
    sessionId: string,
    playerNickname: string,
    exitSession?: () => void,
};

export const GameSession: React.FC<GameSessionProps> = ({
    sessionId, playerNickname, exitSession,
}) => {

    const [appContextState, setAppContextState] = useState(appContextInitState);
    const [connectingToSession, setConnectingToSession] = useState(true);

    useEffect(() => {
        setConnectingToSession(true);

        // Init socket, without auto connecting
        const socket = io(createSessionSocketURI(sessionId), {
            autoConnect: false,
        });

        // Register event listeners
        const cleanupListeners = registerEventListenersHelper({
            connect: () => {
                console.log(
                    `SocketIO connection established. Socket ID: ${socket.id}`
                );
            },
            disconnect: (
                reason: Socket.DisconnectReason,
                description?: DisconnectDescription
            ) => {
                alert(`Server disconnected. See console for more details.`);
                console.error('Server Disconnected. Reason: ', reason);
                console.error('Server disconnection description: ', description);
                exitSession?.();
            },
            [ServerEventType.WAITING_4_JOIN]: eventHandlerWrapper(
                zWaitingForJoinEvent.parse, e => {
                    setAppContextState(s => handleWaitingForJoinEvent(s, e));
                    socket.emit(
                        ClientEventType.JOIN_GAME, {
                            data: {
                                playerNickname: playerNickname,
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
    }, [sessionId, playerNickname, exitSession]);

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
