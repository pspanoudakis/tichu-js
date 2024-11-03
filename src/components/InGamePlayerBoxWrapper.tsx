import React, { useContext, useMemo } from "react";
import { PlayerInfoHeader } from "./PlayerInfoHeader";
import { inGamePlayerBoxClass } from "./styleUtils";
import { PlayerKey } from "../game_logic/shared/shared";
import { AppContext } from "../AppContext";
import { usePlayerAccessProperty } from "../hooks/usePlayerAccessKey";

export const InGamePlayerBoxWrapper: React.FC<{
    playerKey?: PlayerKey
}> = (props) => {

    const { state: ctxState } = useContext(AppContext);

    const playerProperty = usePlayerAccessProperty(props.playerKey);

    const nickname =
        playerProperty &&
        ctxState.gameContext[playerProperty]?.nickname;
    const numCards = (
        playerProperty &&
        ctxState.gameContext.currentRoundState?.[playerProperty].numberOfCards
    ) ?? 0;
    const currentBet =
        playerProperty &&
        ctxState.gameContext.currentRoundState?.[playerProperty].playerBet;

    const currentRoundState = ctxState.gameContext.currentRoundState;
    const isPlayingNow =
        currentRoundState?.playerInTurnKey &&
        (currentRoundState?.playerInTurnKey === props.playerKey);
    const isDroppingBomb =
        isPlayingNow && currentRoundState?.tableState.pendingBomb;

    const { color, text } = useMemo<{
        color: string,
        text?: string
    }>(() => {
        if (isDroppingBomb) {
            return {
                color: '#7f0707',
                text: 'Bomb'
            };
        }
        if (isPlayingNow) {
            return {
                color: '#075907',
                text: 'Now Playing'
            };
        }
        return {
            color: 'transparent'
        }
    }, [isPlayingNow, isDroppingBomb]);

    return (
        <div className={inGamePlayerBoxClass}>
            <div style={{
                borderTopLeftRadius: 'max(0.30vw, 0.50vh)',
                borderTopRightRadius: 'max(0.30vw, 0.50vh)',
                backgroundColor: color,
                paddingTop: '0.35vh',
                paddingBottom: '0.35vh',
                textAlign: 'center',
                minHeight: '2.4vh'
            }}>
                {text}
            </div>
            <PlayerInfoHeader
                nickname={nickname ?? props.playerKey}
                bet={currentBet}
                numCards={numCards}
            />
            { props.children }
        </div>
    );
};
