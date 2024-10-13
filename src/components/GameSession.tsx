import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createSessionSocketURI } from "../API/coreAPI";
import { zServerEvent } from "../shared/ServerEvents";
import { createInitialGameState } from "../state_types/GameState";
import { PLAYER_KEYS } from "../shared/shared";

type GameSessionProps = {
    sessionId: string,
    playerNickname: string,
};

export const GameSession: React.FC<GameSessionProps> = (props) => {

    const [connectingToSession, setConnectingToSession] = useState(true);
    const [gameState, setGameState] = useState(createInitialGameState());

    useEffect(() => {
        setConnectingToSession(true);

        // Init socket, without auto connecting
        const socket = io(createSessionSocketURI(props.sessionId), {
            autoConnect: false,
        });

        // Register listeners
        socket.on('connect', () => {
            socket.emit(
                'JOIN_GAME', {
                    data: {
                        playerNickname: props.playerNickname,
                    },
                    eventType: "JOIN_GAME",
                }
            );
        });
        socket.onAny((eventType, ev) => {
            const e = zServerEvent.parse(ev)
            if (eventType === 'disconnect') {
                return;
            }
            switch (e.eventType) {
                case 'WAITING_4_JOIN':
                    return setGameState(gs => ({
                        thisPlayer: {
                            playerKey: e.playerKey,
                            playerIndex: -1,
                            nickname: '',
                        },
                        ...gs,
                    }));
                case 'PLAYER_JOINED':
                    return setGameState(gs => ({
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

                    }));
                default:
                    break;
            }
        })

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
