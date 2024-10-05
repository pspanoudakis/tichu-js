import React from 'react';
import { Card } from './Card';
import { gameBets } from '../GameLogic';

import { inGamePlayerBoxClass } from "./styleUtils";
import styles from "../styles/Components.module.css"
import { BetIndicator } from './BetIndicator';

export const HiddenPlayerHand: React.FC<{
    currentBet: gameBets,
    numCards: number,
    style: string,
    id: string
}> = props => (
    <div className={props.style}>
        <div className={inGamePlayerBoxClass}>
            <div className={styles.playerInfo}>
                <span className={styles.playerIDSpan}>{props.id}</span>
                <BetIndicator bet={props.currentBet}/>
            </div>
            <div className={styles.playerCardList}>{
                Array.from({ length: props.numCards }).map((_, i) => {
                    const cardStyle: React.CSSProperties = {
                        position: 'absolute',
                        left: (i * 6.5).toString() + '%',
                        bottom: '15%',
                        transition: '85ms, left 100ms',
                        height: '65%',
                    }
                    return (
                        <Card
                            key={i} id={i.toString()}
                            cardImg={'./res/background.png'} alt={'hidden'}
                            style={cardStyle}
                        />
                    );
                })
            }</div>
        </div>
    </div>
);
