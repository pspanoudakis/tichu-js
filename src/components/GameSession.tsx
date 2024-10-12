import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createSessionSocketURI } from "../API/coreAPI";

export const GameSession: React.FC<{
    sessionId: string,
    playerNickname: string,
}> = (props) => {

    const [connectingToSession, setConnectingToSession] = useState(true);

    useEffect(() => {
        setConnectingToSession(true);

        // Init socket, without auto connecting
        const uri = createSessionSocketURI(props.sessionId);
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
        socket.on('PLAYER_JOINED', (data) => {
            console.log(data);
        })

        // Connect after listeners registered
        socket.connect();

        // On unmount, cleanup
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        }
    }, [props.sessionId]);

    return (
        connectingToSession ?
        <div>
            Connecting to session...
        </div>
        :
        <div>Connected to session!</div>
    );
}
