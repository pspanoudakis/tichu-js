import React, { useEffect, useContext } from "react";
import { HiddenPlayerHand } from "./HiddenPlayerHand";
import { BetPhasePlayerHand } from "./BetPhasePlayerHand";
import { ControlledPlayerHand } from "./ControlledPlayerHand";
import {
    AppContext,
    handleGameRoundStartedEvent,
    handleTableRoundStartedEvent
} from "../AppContext";
import styles from "../styles/Components.module.css";
import {
    ServerEventType,
    zGameRoundStartedEvent,
    zTableRoundStartedEvent
} from "../game_logic/shared/ServerEvents";
import {
    eventHandlerWrapper,
    registerEventListenersHelper
} from "../utils/eventUtils";
import { TableNew } from "./TableNew";

export const GameRound: React.FC<{}> = (props) => {

    const {state: ctxState, setState: setCtxState} = useContext(AppContext);
    
    useEffect(() => registerEventListenersHelper({
        [ServerEventType.GAME_ROUND_STARTED]: eventHandlerWrapper(
            zGameRoundStartedEvent.parse, e => {
                handleGameRoundStartedEvent(e, setCtxState);
            }
        ),
        [ServerEventType.TABLE_ROUND_STARTED]: eventHandlerWrapper(
            zTableRoundStartedEvent.parse, e => {
                handleTableRoundStartedEvent(e, setCtxState);
            }
        ),
    }, ctxState.socket), [ctxState.socket, setCtxState]);

    const roundPhase = ctxState.gameContext.currentRoundState?.currentPhase;
    switch (roundPhase) {
        case undefined:
        case 'TRADES':
            return (
                <div className={styles.gameboardPreTradesStyle}>
                    <div className={styles.preTradesCol}>
                        <HiddenPlayerHand
                            playerKey={ctxState.gameContext.leftOpponent?.playerKey}
                            style={styles.preTradePlayerBox}
                        />
                    </div>
                    <div className={styles.preTradesCol}>
                        <HiddenPlayerHand
                            playerKey={ctxState.gameContext.teammate?.playerKey}
                            style={styles.preTradePlayerBox}
                        />
                        <BetPhasePlayerHand/>
                    </div>
                    <div className={styles.preTradesCol}>
                        <HiddenPlayerHand
                            playerKey={ctxState.gameContext.rightOpponent?.playerKey}
                            style={styles.preTradePlayerBox}
                        />
                    </div>
                </div>
            );
        case 'OVER':
        case 'MAIN':
            return (
                <div className={styles.gameboardStyle}>
                    <HiddenPlayerHand
                        playerKey={ctxState.gameContext.teammate?.playerKey}
                        style={styles.teammate}
                    />
                    <HiddenPlayerHand
                        playerKey={ctxState.gameContext.leftOpponent?.playerKey}
                        style={styles.leftOpponent}
                    />
                    <div className={styles.tableStyle}>
                    <TableNew/>
                    </div>
                    <HiddenPlayerHand
                        playerKey={ctxState.gameContext.rightOpponent?.playerKey}
                        style={styles.rightOpponent}
                    />
                    <ControlledPlayerHand/>
                </div>
            )
        default:
            throw new Error(`Unexpected Round Phase: ${roundPhase}`);
    }
}
