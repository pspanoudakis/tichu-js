import React, { useState } from "react";
import { createSession, getOpenSession } from "../API/sessionAPI";
import { GameSession } from "./GameSession";

export const AppRoot: React.FC<{}> = (props) => {

    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
    const [nickname, setNickname] = useState('');

    const onCreate = () => {
        if (!nickname)
            return alert('Please select a nickname.');
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

    const onJoin = () => {
        if (!nickname)
            return alert('Please select a nickname.');
        setLoading(true);
        getOpenSession()
            .then(({ sessionId }) => {
                setCurrentSessionId(sessionId);
            })
            .catch((e) => {
                alert('Failed to join open session.');
            })
            .finally(() => setLoading(false));
    }

    return <>{
        loading ?
        <div>Loading...</div>
        : (
            currentSessionId ?
            <GameSession
                sessionId={currentSessionId}
                playerNickname={nickname}
            />
            :
            <div>
                <button onClick={onCreate}>Create New Room</button>
                <button onClick={onJoin}>Join Open Room</button>
                <h2>Nickname: </h2>
                <input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                />      
            </div>
        )
    }</>;
}
