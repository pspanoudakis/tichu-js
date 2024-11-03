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

export const TableNew: React.FC<{}> = (props) => {

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

    const isPlayerPlaying = (
        ctxState.gameContext.currentRoundState?.playerInTurnKey ===
        ctxState.gameContext.thisPlayer?.playerKey
    );

    const isDragonSelectionPending =
        currentRoundState?.tableState.pendingDragonSelection;

    return (
        <div className={styles.tableBox}>
            <span className={styles.requestedCardTable}>{
                requestedCardName ? `Requested: ${requestedCardName}` : ''
            }</span>
            {
                (isPlayerPlaying && isDragonSelectionPending) ?
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
    );;
};
