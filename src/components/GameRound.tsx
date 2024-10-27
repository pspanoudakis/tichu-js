import React, { useState, useEffect, useContext } from "react";
import { HiddenPlayerHand } from "./HiddenPlayerHand";
import { BetPhasePlayerHand } from "./BetPhasePlayerHand";
import { ControlledPlayerHand } from "./ControlledPlayerHand";
import { AppContext, handleGameRoundStartedEvent, handleTableRoundStartedEvent } from "../AppContext";
import styles from "../styles/Components.module.css";
import { ServerEventType, zGameRoundStartedEvent, zTableRoundStartedEvent } from "../game_logic/shared/ServerEvents";
import { eventHandlerWrapper } from "../utils/eventUtils";

type GameRoundPhase = 'WAIT4START' | 'TRADES' | 'MAIN' | 'OVER';

export const GameRound: React.FC<{
    initialState?: GameRoundPhase
}> = (props) => {

    const ctx = useContext(AppContext);
    const [roundPhase, setRoundPhase] = useState(props.initialState ?? 'WAIT4START');

    useEffect(() => {
        ctx.state.socket
            ?.on(ServerEventType.GAME_ROUND_STARTED, eventHandlerWrapper(
                zGameRoundStartedEvent.parse, e => {
                    handleGameRoundStartedEvent(ctx, e);
                    setRoundPhase('TRADES')
                }
            ))
            .on(
                ServerEventType.TABLE_ROUND_STARTED, eventHandlerWrapper(
                    zTableRoundStartedEvent.parse, e => {
                        handleTableRoundStartedEvent(ctx, e);
                        setRoundPhase('MAIN');
                    }
                )
            );
        
        return () => {
            ctx.state.socket?.removeAllListeners(ServerEventType.GAME_ROUND_STARTED);
            ctx.state.socket?.removeAllListeners(ServerEventType.TABLE_ROUND_STARTED);
        }
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
        case 'WAIT4START':
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
