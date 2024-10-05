import React from 'react';
import { gameBets } from "../GameLogic";
import { grandTichuBetDivClass, tichuBetDivClass } from "./styleUtils";

export const BetIndicator: React.FC<{
    bet: gameBets
}> = (props) => {
    switch (props.bet) {
        case gameBets.TICHU:
            return (
                <div className={tichuBetDivClass}>
                    Tichu
                </div>
            );
        case gameBets.GRAND_TICHU:
            return (
                <div className={grandTichuBetDivClass}>
                    Grand Tichu
                </div>
            );
        default:
            return <span></span>;
    }
};
