import React, { useContext, useMemo } from 'react';
import { Card } from './Card';

import { inGamePlayerBoxClass } from "./styleUtils";
import styles from "../styles/Components.module.css"
import { BetIndicator } from './BetIndicator';
import { PlayerKey } from '../game_logic/shared/shared';
import { AppContext } from '../AppContext';
import { cardImages } from '../CardResources';

export const HiddenPlayerHand: React.FC<{
    playerKey?: PlayerKey,
    style: string,
}> = props => {

    const ctx = useContext(AppContext);

    const playerAccessKey = useMemo(() => {
        switch (props.playerKey) {
            case ctx.state.gameContext.teammate?.playerKey:
                return 'teammate';
            case ctx.state.gameContext.rightOpponent?.playerKey:
                return 'rightOpponent';
            case ctx.state.gameContext.leftOpponent?.playerKey:
                return 'leftOpponent';
            default:
                throw new Error(`Cannot find player with key: '${props.playerKey}'`);
        }
    }, [
        props.playerKey,
        ctx.state.gameContext.teammate?.playerKey,
        ctx.state.gameContext.leftOpponent?.playerKey,
        ctx.state.gameContext.rightOpponent?.playerKey,
    ]);

    const nickname = ctx.state.gameContext[playerAccessKey]?.nickname;
    const numCards = ctx.state.gameContext.currentRoundState?.[playerAccessKey].numberOfCards ?? 0;
    const currentBet = ctx.state.gameContext.currentRoundState?.[playerAccessKey].playerBet;

    return (
        <div className={props.style}>
            <div className={inGamePlayerBoxClass}>
                <div className={styles.playerInfo}>
                    <span className={styles.playerIDSpan}>
                        {nickname} - Cards: {numCards}
                    </span>
                    <BetIndicator bet={currentBet}/>
                </div>
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
