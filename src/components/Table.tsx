import React, { useContext, useEffect, useMemo } from "react";
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
    ServerEventType,
    zBombDroppedEvent,
    zCardRequestedEvent,
    zCardsPlayedEvent,
    zDragonGivenEvent,
    zPendingDragonDecisionEvent,
    zTurnPassedEvent
} from "../game_logic/shared/ServerEvents";
import styles from "../styles/Components.module.css";
import { Card } from "./Card";
import { UICardInfo } from "../game_logic/UICardInfo";
import { DragonSelectionContainer } from "./DragonSelectionContainer";
import { usePlayerAccessProperty } from "../hooks/usePlayerAccessKey";

export const Table: React.FC<{}> = (props) => {

    const { state: ctxState, setState: setCtxState } = useContext(AppContext);

    useEffect(() => registerEventListenersHelper({
        [ServerEventType.CARDS_PLAYED]: eventHandlerWrapper(
            zCardsPlayedEvent.parse,
            e => handleCardsPlayedEvent(e, setCtxState)
        ),
        [ServerEventType.TURN_PASSED]: eventHandlerWrapper(
            zTurnPassedEvent.parse,
            e => handleTurnPassedEvent(e, setCtxState)
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
            zDragonGivenEvent.parse, e => {
                // Probably just UI logic
            }
        ),
        [ServerEventType.BOMB_DROPPED]: eventHandlerWrapper(
            zBombDroppedEvent.parse,
            e => handleBombDroppedEvent(e, setCtxState)
        ),
    }, ctxState.socket), [ctxState.socket, setCtxState]);

    const currentRoundState = ctxState.gameContext.currentRoundState;

    const requestedCardName = currentRoundState?.requestedCardName;

    const tableCards = useMemo(() =>
        // Table cards are sent sorted
        currentRoundState?.tableState.currentCardKeys
            ?.map(k => new UICardInfo(k)) ?? []
    , [currentRoundState?.tableState.currentCardKeys]);

    const isPlayerCardsOwner = (
        ctxState.gameContext.currentRoundState?.tableState.currentCardsOwner ===
        ctxState.gameContext.thisPlayer?.playerKey
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
                        cardsOwnerProperty &&
                        `By: ${ctxState.gameContext[cardsOwnerProperty]?.nickname}`
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
            </div>
        </div>
    );;
};
