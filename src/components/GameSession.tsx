import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createSessionSocketURI } from "../API/coreAPI";
import { zPlayerJoinedEvent, zWaitingForJoinEvent } from "../shared/ServerEvents";
import { createInitialGameState } from "../state_types/GameState";
import { PLAYER_KEYS } from "../shared/shared";

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

    const [connectingToSession, setConnectingToSession] = useState(true);
    const [gameState, setGameState] = useState(createInitialGameState());

    useEffect(() => {
        setConnectingToSession(true);

        // Init socket, without auto connecting
        const socket =
        io(createSessionSocketURI(props.sessionId), {
            autoConnect: false,
        })
        // Register listeners
        .on('connect', () => {
            socket.emit(
                'JOIN_GAME', {
                    data: {
                        playerNickname: props.playerNickname,
                    },
                    eventType: "JOIN_GAME",
                }
            );
        }).on('WAITING_4_JOIN', eventHandlerWrapper(
            zWaitingForJoinEvent.parse, e => {
                setGameState(gs => ({
                    thisPlayer: {
                        playerKey: e.playerKey,
                        playerIndex: -1,
                        nickname: '',
                    },
                    ...gs,
                }));
            }
        )).on('PLAYER_JOINED', eventHandlerWrapper(
            zPlayerJoinedEvent.parse, e => {
                setGameState(gs => ({
                    ...gs,
                    thisPlayer: e.playerKey === gs.thisPlayer?.playerKey ? {
                        ...gs.thisPlayer,
                        playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                        nickname: e.data.playerNickname,
                    } : gs.thisPlayer,
                    leftOpponent: e.playerKey === gs.leftOpponent?.playerKey ? {
                        ...gs.leftOpponent,
                        playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                        nickname: e.data.playerNickname,
                    } : gs.leftOpponent,
                    rightOpponent: e.playerKey === gs.rightOpponent?.playerKey ? {
                        ...gs.rightOpponent,
                        playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                        nickname: e.data.playerNickname,
                    } : gs.rightOpponent,
                    teammate: e.playerKey === gs.teammate?.playerKey ? {
                        ...gs.teammate,
                        playerIndex: PLAYER_KEYS.indexOf(e.playerKey),
                        nickname: e.data.playerNickname,
                    } : gs.teammate,

                }))
            }
        ))

        // Connect after listeners registered
        socket.connect();

        // On unmount, cleanup
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        }
    }, [props.sessionId, props.playerNickname]);

    return (
        connectingToSession ?
        <div>
            Connecting to session...
        </div>
        :
        <div>Connected to session!</div>
    );
}
