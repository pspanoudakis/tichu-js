import React, { useContext, useMemo } from 'react';
import { Card } from './Card';

import { inGamePlayerBoxClass } from "./styleUtils";
import styles from "../styles/Components.module.css"
import { BetIndicator } from './BetIndicator';
import { PlayerKey } from '../game_logic/shared/shared';
import { AppContext } from '../AppContext';
import { cardImages } from '../CardResources';
import { PlayerInfoHeader } from './PlayerInfoHeader';

export const HiddenPlayerHand: React.FC<{
    playerKey?: PlayerKey,
    style: string,
}> = props => {

    const { state: ctxState } = useContext(AppContext);

    const playerAccessKey = useMemo(() => {
        switch (props.playerKey) {
            case ctxState.gameContext.teammate?.playerKey:
                return 'teammate';
            case ctxState.gameContext.rightOpponent?.playerKey:
                return 'rightOpponent';
            case ctxState.gameContext.leftOpponent?.playerKey:
                return 'leftOpponent';
            default:
                throw new Error(`Cannot find player with key: '${props.playerKey}'`);
        }
    }, [
        props.playerKey,
        ctxState.gameContext.teammate?.playerKey,
        ctxState.gameContext.leftOpponent?.playerKey,
        ctxState.gameContext.rightOpponent?.playerKey,
    ]);

    const nickname = ctxState.gameContext[playerAccessKey]?.nickname;
    const numCards = ctxState.gameContext.currentRoundState?.[playerAccessKey].numberOfCards ?? 0;
    const currentBet = ctxState.gameContext.currentRoundState?.[playerAccessKey].playerBet;

    return (
        <div className={props.style}>
            <div className={inGamePlayerBoxClass}>
                <PlayerInfoHeader
                    nickname={nickname ?? props.playerKey}
                    bet={currentBet}
                    numCards={numCards}
                />
                <div className={styles.playerCardList}>{
                    Array.from({ length: numCards }).map((_, i) => {
                        return (
                            <Card
                                key={i} id={i.toString()} index={i}
                                cardImg={'cardBackground'}
                                alt='hidden'
                            />
                        );
                    })
                }</div>
            </div>
        </div>
    )
};
