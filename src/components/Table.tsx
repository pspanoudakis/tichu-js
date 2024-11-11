import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    AppContext,
    handleBombDroppedEvent,
    handleCardRequestedEvent,
    handleCardsPlayedEvent, 
    handlePendingDragonDecisionEvent, 
    handleTurnPassedEvent} from "../AppContext";
import {
    eventHandlerWrapper,
    registerEventListenersHelper
} from "../utils/eventUtils";
import {
    ServerEvent,
    ServerEventType,
    zBombDroppedEvent,
    zCardRequestedEvent,
    zCardsPlayedEvent,
    zDragonGivenEvent,
    zPendingDragonDecisionEvent,
    zTableRoundEndedEvent,
    zTurnPassedEvent
} from "../game_logic/shared/ServerEvents";
import styles from "../styles/Components.module.css";
import { Card } from "./Card";
import { UICardInfo } from "../game_logic/UICardInfo";
import { DragonSelectionContainer } from "./DragonSelectionContainer";
import { usePlayerAccessProperty } from "../hooks/usePlayerAccessProperty";
import { getCardConfigByKey } from "../game_logic/shared/CardConfig";

export const Table: React.FC<{}> = (props) => {

    const { state: ctxState, setState: setCtxState } = useContext(AppContext);
    const gc = ctxState.gameContext;
    const [lastAction, setLastAction] = useState<ServerEvent>();

    useEffect(() => registerEventListenersHelper({
        [ServerEventType.CARDS_PLAYED]: eventHandlerWrapper(
            zCardsPlayedEvent.parse,
            e => {
                handleCardsPlayedEvent(e, setCtxState);
                setLastAction(e);
            }
        ),
        [ServerEventType.TURN_PASSED]: eventHandlerWrapper(
            zTurnPassedEvent.parse,
            e => {
                handleTurnPassedEvent(e, setCtxState);
                setLastAction(e);
            }
        ),
        [ServerEventType.CARD_REQUESTED]: eventHandlerWrapper(
            zCardRequestedEvent.parse,
            e => handleCardRequestedEvent(e, setCtxState)
        ),
        [ServerEventType.PENDING_DRAGON_DECISION]: eventHandlerWrapper(
            zPendingDragonDecisionEvent.parse,
            e => handlePendingDragonDecisionEvent(e, setCtxState)
        ),
        [ServerEventType.DRAGON_GIVEN]: eventHandlerWrapper(
            zDragonGivenEvent.parse, e => setLastAction(e)
        ),
        [ServerEventType.BOMB_DROPPED]: eventHandlerWrapper(
            zBombDroppedEvent.parse,
            e => handleBombDroppedEvent(e, setCtxState)
        ),
        [ServerEventType.TABLE_ROUND_ENDED]: eventHandlerWrapper(
            zTableRoundEndedEvent.parse, e => setLastAction(e)
        )
    }, ctxState.socket), [ctxState.socket, setCtxState]);

    const currentRoundState = gc.currentRoundState;

    const lastActionPlayerProperty = usePlayerAccessProperty(lastAction?.playerKey);
    const dragonCollectorProperty = usePlayerAccessProperty(
        (lastAction?.eventType === ServerEventType.DRAGON_GIVEN) ?
        lastAction.data.dragonReceiverKey : undefined
    );
    const tableRoundWinnerProperty = usePlayerAccessProperty(
        (lastAction?.eventType === ServerEventType.TABLE_ROUND_ENDED) ?
        lastAction.data.roundWinner : undefined
    );
    const lastActionPlayerNickname = 
        lastActionPlayerProperty && gc[lastActionPlayerProperty]?.nickname;
    const dragonCollectorNickname =
        dragonCollectorProperty && gc[dragonCollectorProperty]?.nickname;
    const tableRoundWinnerNickname =
        tableRoundWinnerProperty && gc[tableRoundWinnerProperty]?.nickname;
    const lastActionDesc = useMemo(() => {
        switch (lastAction?.eventType) {
            case ServerEventType.CARDS_PLAYED:
                const cardNames = lastAction.data.tableCardKeys.map(
                    k => getCardConfigByKey(k)?.name
                );
                return `${lastActionPlayerNickname} played: ${cardNames.join(' ')}`;
            case ServerEventType.TURN_PASSED:
                return `${lastActionPlayerNickname} passed.`;
            case ServerEventType.TABLE_ROUND_ENDED:
                return `${tableRoundWinnerNickname} collected the cards.`;
            case ServerEventType.DRAGON_GIVEN:
                return `The cards were given to ${dragonCollectorNickname}.`;
            default:
                break;
        }
    }, [
        lastAction,
        lastActionPlayerNickname,
        dragonCollectorNickname,
        tableRoundWinnerNickname
    ]);

    const requestedCardName = currentRoundState?.requestedCardName;

    const tableCards = useMemo(() =>
        // Table cards are sent sorted
        currentRoundState?.tableState.currentCardKeys
            ?.map(k => new UICardInfo(k)) ?? []
    , [currentRoundState?.tableState.currentCardKeys]);

    const isPlayerCardsOwner = (
        gc.currentRoundState?.tableState.currentCardsOwner ===
        gc.thisPlayer?.playerKey
    );

    const cardsOwnerProperty =
        usePlayerAccessProperty(currentRoundState?.tableState.currentCardsOwner);

    const isDragonSelectionPending =
        currentRoundState?.tableState.pendingDragonSelection;

    return (
        <div className={styles.tableStyle}>
            <div className={styles.tableBox}>
                <div
                    style={{
                        paddingLeft: '2%',
                        paddingRight: '2%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>{
                        requestedCardName ? `Requested: ${requestedCardName}` : ''
                    }</span>
                    <span>{
                        lastActionDesc || null
                    }</span>
                </div>
                {
                    (isPlayerCardsOwner && isDragonSelectionPending) ?
                    <DragonSelectionContainer/>
                    :
                    <div className={styles.tableCardList}>{
                        tableCards.map((card, i) =>
                            <Card
                                key={card.key} id={card.key} index={i}
                                cardImg={card.img} alt={card.imgAlt}
                            />
                        )
                    }</div>
                }
                <span>{
                    cardsOwnerProperty &&
                    `By: ${gc[cardsOwnerProperty]?.nickname}`
                }</span>
            </div>
        </div>
    );
};
