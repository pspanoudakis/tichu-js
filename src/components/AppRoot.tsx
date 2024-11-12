import React, { useCallback, useState } from "react";
import { createSession, getOpenSession } from "../API/sessionAPI";
import { GameSession } from "./GameSession";
import { WinScoreSelector } from "./WinScoreSelector";

import styles from "../styles/Components.module.css";
import tichuLogo from "../res/tichu_logo.png"

export const AppRoot: React.FC<{}> = (props) => {

    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
    const [nickname, setNickname] = useState('');
    const [winningScore, setWinningScore] = useState(0);

    const onCreate = useCallback(() => {
        if (!nickname)
            return alert('Please select a nickname.');
        setLoading(true);
        createSession(winningScore)
            .then(({ sessionId }) => {
                setCurrentSessionId(sessionId);
            })
            .catch((e) => {
                alert('Failed to create new session.');
            })
            .finally(() => setLoading(false));
    }, [winningScore, nickname]);

    const onJoin = useCallback(() => {
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
    }, [nickname]);

    const onWinningScoreSelected = useCallback(
        (s: number) => setWinningScore(s), []
    );

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
            <div className={styles.enteringSceneContainer}>
                <img src={tichuLogo} alt={"Tichu Logo"} className={styles.gameLogo}/>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: '1ch',
                }}>
                    <span>Nickname:</span>
                    <input
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'start',
                    rowGap: '1ch',
                }}>
                    <WinScoreSelector onSelected={onWinningScoreSelected}/>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                    }}>
                        <button onClick={onCreate}>Create New Room</button>
                        <button onClick={onJoin}>Join Open Room</button>
                    </div>
                </div>
            </div>
        )
    }</>;
}
