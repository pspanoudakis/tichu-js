import React, { useContext, useMemo } from 'react';
import { Card } from './Card';
import { PlayerKey } from '../game_logic/shared/shared';
import { AppContext } from '../AppContext';
import { InGamePlayerBoxWrapper } from './InGamePlayerBoxWrapper';
import { usePlayerAccessProperty } from '../hooks/usePlayerAccessProperty';

import styles from "../styles/Components.module.css"

export const HiddenPlayerHand: React.FC<{
    playerKey?: PlayerKey,
    style: string,
}> = props => {

    const { state: ctxState } = useContext(AppContext);

    const playerProperty = usePlayerAccessProperty(props.playerKey);
    const numCards = (
        playerProperty &&
        ctxState.gameContext.currentRoundState?.[playerProperty].numberOfCards
    ) ?? 0;

    const cardsList = useMemo(
        () => Array.from({ length: numCards }).map((_, i) => {
            return (
                <Card
                    key={i} id={i.toString()} index={i}
                    cardImg={'cardBackground'}
                    alt='hidden'
                />
            );
        }), [numCards]
    );

    return (
        <div className={props.style}>
            <InGamePlayerBoxWrapper
                playerKey={props.playerKey}
            >
                <div className={styles.playerCardList}>
                    { cardsList }
                </div>
            </InGamePlayerBoxWrapper>
        </div>
    )
};
