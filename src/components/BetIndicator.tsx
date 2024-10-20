import React from 'react';
import { grandTichuBetDivClass, tichuBetDivClass } from "./styleUtils";
import { PlayerBet } from '../game_logic/shared/shared';

export const BetIndicator: React.FC<{
    bet?: PlayerBet
}> = (props) => {
    switch (props.bet) {
        case PlayerBet.TICHU:
            return (
                <div className={tichuBetDivClass}>
                    Tichu
                </div>
            );
        case PlayerBet.GRAND_TICHU:
            return (
                <div className={grandTichuBetDivClass}>
                    Grand Tichu
                </div>
            );
        default:
            return <span></span>;
    }
};
