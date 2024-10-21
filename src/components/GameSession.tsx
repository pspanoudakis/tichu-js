import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createSessionSocketURI } from "../API/coreAPI";
import {
    ServerEventType,
    zGameRoundStartedEvent,
    zPlayerJoinedEvent,
    zWaitingForJoinEvent
} from "../game_logic/shared/ServerEvents";
import { Scoreboard } from "./Scoreboard";

import styles from "../styles/Components.module.css"
import {
    AppContext,
    appContextInitState,
    handleGameRoundStartedEvent,
    handlePlayerJoinedEvent,
    handleWaitingForJoinEvent
} from "../AppContext";
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

function eventHandlerWrapper<EventType>(
    validator: (e: any) => EventType,
    eventHandler: (e: EventType) => void,
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
            console.log(`SocketIO connection established. Socket ID: ${socket.id}`);
        }).on(ServerEventType.WAITING_4_JOIN, eventHandlerWrapper(
            zWaitingForJoinEvent.parse, e => {
                setAppContextState(ctx => handleWaitingForJoinEvent(ctx, e));
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
                setAppContextState(ctx => handlePlayerJoinedEvent(ctx, e));
            }
        )).on(ServerEventType.GAME_ROUND_STARTED, eventHandlerWrapper(
            zGameRoundStartedEvent.parse, e => {
                setAppContextState(ctx => handleGameRoundStartedEvent(ctx, e))
            }
        ));

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
