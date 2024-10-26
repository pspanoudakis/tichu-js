import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Card } from "./Card";

import { preTradePlayerBoxClass } from "./styleUtils";
import styles from "../styles/Components.module.css"
import { addIncomingTradedCards, AppContext, handleAllCardsRevealedEvent, removeOutcomingTradedCards } from "../AppContext";
import { UICardInfo } from "../game_logic/UICardInfo";
import { PlayerInfoHeader } from "./PlayerInfoHeader";
import {
    ServerEventType,
    zAllCardsRevealedEvent,
    zCardsTradedEvent
} from "../game_logic/shared/ServerEvents";
import { eventHandlerWrapper } from "../utils/eventUtils";
import { CardInfo } from "../game_logic/shared/CardInfo";
import { PlayerBet } from "../game_logic/shared/shared";
import {
    ClientEventType,
    PlaceBetEvent,
    RevealAllCardsEvent,
    TradeCardsEvent
} from "../game_logic/shared/ClientEvents";
import { TradeDecisions } from "../game_logic/TradeDecisions";

export const BetPhasePlayerHand: React.FC<{}> = () => {

    const ctx = useContext(AppContext);
    const playerCardKeys =
        ctx.state.gameContext.currentRoundState?.thisPlayer.cardKeys ?? [];

    const playerBet = ctx.state.gameContext.currentRoundState?.thisPlayer.playerBet;

    const [cardsExpanded, setCardsExpanded] = useState(false);
    const [tradesSent, setTradesSent] = useState(false);
    const [tradesReceived, setTradesReceived] = useState(false);
    const [tradeDecisions, setTradeDecisions] = useState<TradeDecisions>({
        teammate: undefined,
        leftOp: undefined,
        rightOp: undefined,
    });

    useEffect(() => {
        ctx.state.socket
            ?.on(
                ServerEventType.ALL_CARDS_REVEALED, eventHandlerWrapper(
                zAllCardsRevealedEvent.parse, e => {
                    ctx.setState?.(s => handleAllCardsRevealedEvent(s, e));
                    setCardsExpanded(true);
                }
            ))
            .on(
                ServerEventType.CARDS_TRADED, eventHandlerWrapper(
                zCardsTradedEvent.parse, e => {
                    ctx.setState?.(s => addIncomingTradedCards(s, e));
                    setTradesReceived(true);
                    setTradeDecisions({
                        teammate: new UICardInfo(e.data.cardByTeammate),
                        leftOp: new UICardInfo(e.data.cardByLeft),
                        rightOp: new UICardInfo(e.data.cardByRight),
                    });
                }
            ));
        return () => {
            const socket = ctx.state.socket;
            if (!socket) return;
            socket.removeAllListeners(ServerEventType.ALL_CARDS_REVEALED);
            socket.removeAllListeners(ServerEventType.CARDS_TRADED);
        }
    }, [ctx.state.socket,]);

    const allCards = useMemo(
        () => playerCardKeys.map(k => new UICardInfo(k)).sort(CardInfo.compareCards),
        [playerCardKeys]
    );

    const nonSelectedCards = useMemo(() => {
        return allCards.filter(c => (
            c.key !== tradeDecisions.teammate?.key &&
            c.key !== tradeDecisions.leftOp?.key &&
            c.key !== tradeDecisions.rightOp?.key
        ));
    }, [
        tradeDecisions.teammate,
        tradeDecisions.leftOp,
        tradeDecisions.rightOp,
        allCards,
    ]);

    useEffect(() => {
        if (tradesReceived) {
            ctx.setState?.(s => removeOutcomingTradedCards(s, tradeDecisions));
        }
    }, [tradesReceived, tradeDecisions]);

    const onBetPlaced = useCallback((bet: PlayerBet.TICHU | PlayerBet.GRAND_TICHU) => {
        const e: PlaceBetEvent = {
            eventType: ClientEventType.PLACE_BET,
            data: {
                betPoints: bet,
            } ,
        }
        ctx.state.socket?.emit(ClientEventType.PLACE_BET, e);
        
    }, [ctx.state.socket]);

    const onTichuBetPlaced = useCallback(
        () => onBetPlaced(PlayerBet.TICHU), [onBetPlaced]
    );
    const onGrandTichuBetPlaced = useCallback(
        () => onBetPlaced(PlayerBet.GRAND_TICHU), [onBetPlaced]
    );

    const onCardsExpanded = useCallback(() => {
        const e: RevealAllCardsEvent = {
            eventType: ClientEventType.REVEAL_ALL_CARDS
        };
        ctx.state.socket?.emit(ClientEventType.REVEAL_ALL_CARDS, e);
    }, [ctx.state.socket]);

    const onTradesFinalized = useCallback(() => {
        if (
            tradeDecisions.teammate?.key &&
            tradeDecisions.leftOp?.key &&
            tradeDecisions.rightOp?.key
        ) {
            const e: TradeCardsEvent = {
                eventType: ClientEventType.TRADE_CARDS,
                data: {
                    teammateCardKey: tradeDecisions.teammate.key,
                    leftCardKey: tradeDecisions.leftOp.key,
                    rightCardKey: tradeDecisions.rightOp.key,
                }
            };
            ctx.state.socket?.emit(
                ClientEventType.TRADE_CARDS, e, () => setTradesSent(true)
            );
        } else {
            alert('Trade decisions are incomplete.');
        }
    }, [
        tradeDecisions.teammate?.key,
        tradeDecisions.leftOp?.key,
        tradeDecisions.rightOp?.key,
        ctx.state.socket,
    ])

    const onCardClicked = useCallback((key: string) => {
        const card = allCards.find(c => c.key === key);
        switch (key) {
            case tradeDecisions.teammate?.key:
                return setTradeDecisions({ ...tradeDecisions, teammate: undefined });
            case tradeDecisions.leftOp?.key:
                return setTradeDecisions({ ...tradeDecisions, leftOp: undefined });
            case tradeDecisions.rightOp?.key:
                return setTradeDecisions({ ...tradeDecisions, rightOp: undefined });
            default:
                if (!tradeDecisions.leftOp)
                    return setTradeDecisions({ ...tradeDecisions, leftOp: card });
                if (!tradeDecisions.teammate)
                    return setTradeDecisions({ ...tradeDecisions, teammate: card });
                if (!tradeDecisions.rightOp)
                    return setTradeDecisions({ ...tradeDecisions, rightOp: card });
                break;
        }
    }, [
        allCards,
        tradeDecisions.teammate?.key,
        tradeDecisions.leftOp?.key,
        tradeDecisions.rightOp?.key,
    ]
    );

    return (
        <div className={preTradePlayerBoxClass}>
            <PlayerInfoHeader
                nickname={ctx.state.gameContext.thisPlayer?.nickname}
                numCards={allCards.length}
                bet={playerBet}
            />
            {
                cardsExpanded ? (
                    <>
                        <div className={styles.preTradeCardList}>{
                            nonSelectedCards.map((card, i) => (
                                <Card
                                    key={card.key} id={card.key} index={i}
                                    cardImg={card.img} alt={card.imgAlt}
                                    onClick={onCardClicked}
                                    isSelected={true}
                                />
                            ))
                        }</div>
                        <div className={styles.tradingCardSlots}>{
                            [
                                tradeDecisions.leftOp,
                                tradeDecisions.teammate,
                                tradeDecisions.rightOp
                            ].map((td, i) => (
                                <div key={i} className={styles.tradingCardSlot}>
                                    <span>{}</span>
                                    {
                                        td !== undefined ?
                                        <Card
                                            key={td.key} id={td.key} index={i}
                                            alt={td.imgAlt} cardImg={td.img} isSelected={true}
                                            onClick={tradesSent ? undefined : onCardClicked}
                                            omitPosition
                                        /> : <span></span>
                                    }
                                </div>
                            ))
                        }</div>
                        <div className={styles.tradePhaseButtonContainer}>
                            {
                                tradesSent ? (
                                    tradesReceived ?
                                    <button className={styles.inactiveButton}>
                                        Received
                                    </button>
                                    :
                                    <button className={styles.inactiveButton}>
                                        Cards Sent
                                    </button>
                                ) : (
                                    <button
                                        className={styles.tradePhaseButton}
                                        onClick={onTradesFinalized}
                                    >
                                        Send
                                    </button>
                                )
                            }
                            {
                                (playerBet === PlayerBet.NONE || !playerBet) && (
                                    <button
                                        className={styles.tradePhaseButton}
                                        onClick={onTichuBetPlaced}
                                    >
                                        Tichu
                                    </button>
                                )
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.preTradeCardList}>{
                            allCards.map((card, i) => (
                                <Card
                                    key={card.key} id={card.key} index={i}
                                    cardImg={card.img} alt={card.imgAlt}
                                    isSelected={true}
                                />
                            ))
                        }</div>
                        <div className={styles.tradingCardSlots}/>
                        <div className={styles.tradePhaseButtonContainer}>
                            <button
                                className={styles.tradePhaseButton}
                                onClick={onCardsExpanded}
                            >
                                Expand Cards
                            </button>
                            {
                                (playerBet === PlayerBet.NONE || !playerBet) && (
                                    <button
                                        className={styles.tradePhaseButton}
                                        onClick={onGrandTichuBetPlaced}
                                    >
                                        Grand Tichu
                                    </button>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
}
