import React, { useState } from "react";
import { createSession } from "../API/sessionAPI";
import { GameSession } from "./GameSession";

export const AppRoot: React.FC<{}> = (props) => {

    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();

    const onCreate = () => {
        setLoading(true);
        createSession(1)
            .then(({ sessionId }) => {
                setCurrentSessionId(sessionId);
            })
            .catch((e) => {
                alert('Failed to create new session.');
            })
            .finally(() => setLoading(false));
    };

    return <>{
        loading ?
        <div>Loading...</div>
        : (
            currentSessionId ?
            <GameSession
                sessionId={currentSessionId}
                playerNickname="Pavlos"
            />
            :
            <div>
                <button
                    onClick={onCreate}
                >
                    Create New Room
                </button>
                <button>Join Open Room</button>            
            </div>
        )
    }</>;
}
