import React, { useCallback, useContext, useMemo } from "react";
import { ClientEventType, PlaceBetEvent } from "../game_logic/shared/ClientEvents";
import { PlayerBet } from "../game_logic/shared/shared";
import { AppContext } from "../AppContext";

type AllowedBet = PlayerBet.TICHU | PlayerBet.GRAND_TICHU

export const PlaceBetButton: React.FC<{
    bet: AllowedBet
    className?: string
}> = (props) => {

    const {state: ctxState} = useContext(AppContext);

    const onBetPlaced = useCallback(() => {
        const e: PlaceBetEvent = {
            eventType: ClientEventType.PLACE_BET,
            data: {
                betPoints: props.bet,
            } ,
        }
        ctxState.socket?.emit(ClientEventType.PLACE_BET, e);
        
    }, [ctxState.socket, props.bet]);

    const label = useMemo(() => {
        switch (props.bet) {
            case PlayerBet.GRAND_TICHU:
                return 'Grand Tichu';
            case PlayerBet.TICHU:
                return 'Tichu';
            default:
                throw new Error(`Unexpected bet: '${props.bet}'`);
        }
    }, [props.bet])

    return (
        <button
            className={props.className}
            onClick={onBetPlaced}
        >
            {label}
        </button>
    );
}