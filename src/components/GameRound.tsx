import React, { useState, useEffect, useContext } from "react";
import { HiddenPlayerHand } from "./HiddenPlayerHand";
import { BetPhasePlayerHand } from "./BetPhasePlayerHand";
import { ControlledPlayerHand } from "./ControlledPlayerHand";
import { AppContext, handleTableRoundStartedEvent } from "../AppContext";
import styles from "../styles/Components.module.css";
import { ServerEventType, zTableRoundStartedEvent } from "../game_logic/shared/ServerEvents";
import { eventHandlerWrapper } from "../utils/eventUtils";

type GameRoundPhase = 'WAIT4JOIN' | 'TRADES' | 'MAIN' | 'OVER';

export const GameRound: React.FC<{
    initialState?: GameRoundPhase
}> = (props) => {

    const ctx = useContext(AppContext);
    const [roundPhase, setRoundPhase] = useState(props.initialState ?? 'TRADES');

    useEffect(() => {
        ctx.state.socket?.on(
            ServerEventType.TABLE_ROUND_STARTED, eventHandlerWrapper(
                zTableRoundStartedEvent.parse, e => {
                    setRoundPhase('MAIN');
                    ctx.setState?.(handleTableRoundStartedEvent(ctx, e));
                }
            )
        );
    }, [ctx.state.socket]);

    switch (roundPhase) {
        case 'TRADES':
            return (
                <div className={styles.gameboardPreTradesStyle}>
                    <div className={styles.preTradesCol}>
                        <HiddenPlayerHand
                            playerKey={ctx.state.gameContext.leftOpponent?.playerKey}
                            style={styles.preTradePlayerBox}
                        />
                    </div>
                    <div className={styles.preTradesCol}>
                        <HiddenPlayerHand
                            playerKey={ctx.state.gameContext.teammate?.playerKey}
                            style={styles.preTradePlayerBox}
                        />
                        <BetPhasePlayerHand/>
                    </div>
                    <div className={styles.preTradesCol}>
                        <HiddenPlayerHand
                            playerKey={ctx.state.gameContext.rightOpponent?.playerKey}
                            style={styles.preTradePlayerBox}
                        />
                    </div>
                </div>
            );
        case 'WAIT4JOIN':
        case 'OVER':
        case 'MAIN':
            return (
                <div className={styles.gameboardStyle}>
                    <HiddenPlayerHand
                        playerKey={ctx.state.gameContext.teammate?.playerKey}
                        style={styles.teammate}
                    />
                    <HiddenPlayerHand
                        playerKey={ctx.state.gameContext.leftOpponent?.playerKey}
                        style={styles.leftOpponent}
                    />
                    <div className={styles.tableStyle}>
                        
                    </div>
                    <HiddenPlayerHand
                        playerKey={ctx.state.gameContext.rightOpponent?.playerKey}
                        style={styles.rightOpponent}
                    />
                    <ControlledPlayerHand/>
                </div>
            )
        default:
            throw new Error(`Unexpected Round Phase: ${roundPhase}`);
    }
}
