import React, { useEffect, useContext } from "react";
import { HiddenPlayerHand } from "./HiddenPlayerHand";
import { BetPhasePlayerHand } from "./BetPhasePlayerHand";
import { ControlledPlayerHand } from "./ControlledPlayerHand";
import {
    AppContext,
    handleGameRoundEndedEvent,
    handleGameRoundStartedEvent,
    handleTableRoundStartedEvent
} from "../AppContext";
import styles from "../styles/Components.module.css";
import {
    ServerEventType,
    zGameRoundEndedEvent,
    zGameRoundStartedEvent,
    zTableRoundStartedEvent
} from "../game_logic/shared/ServerEvents";
import {
    eventHandlerWrapper,
    registerEventListenersHelper
} from "../utils/eventUtils";
import { Table } from "./Table";

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
        [ServerEventType.GAME_ROUND_ENDED]: eventHandlerWrapper(
            zGameRoundEndedEvent.parse, e => {
                alert(
                    `Game Round ended. Round Score: ` +
                    `Team 1-3: ${e.data.roundScore.team02}, ` +
                    `Team 2-4: ${e.data.roundScore.team13}`
                );
                handleGameRoundEndedEvent(e, setCtxState);
            }
        )
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
                    <Table/>
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
