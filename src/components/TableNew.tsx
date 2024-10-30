import React, { useContext, useEffect, useMemo, useCallback } from "react";
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
import { SpecialCards } from "../game_logic/shared/CardConfig";
import { cardImages } from "../CardResources";
import { Card } from "./Card";
import { UICardInfo } from "../game_logic/UICardInfo";
import { CardInfo } from "../game_logic/shared/CardInfo";
import { PlayerKey } from "../game_logic/shared/shared";
import { ClientEventType, GiveDragonEvent } from "../game_logic/shared/ClientEvents";
import { dragonSelection1, dragonSelection2 } from "./styleUtils";

export const TableNew: React.FC<{}> = (props) => {

    const { state: ctxState, setState: setCtxState } = useContext(AppContext);

    useEffect(registerEventListenersHelper({
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
            e => handlePendingDragonDecisionEvent(e)
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
    }, ctxState.socket), [ctxState.socket]);

    const requestedCardName =
        ctxState.gameContext.currentRoundState?.requestedCardName;

    const isDragonSelectionPending =
        ctxState.gameContext.currentRoundState?.tableState.pendingDragonSelection;

    const tableCards = useMemo(() =>
        ctxState.gameContext.currentRoundState?.tableState.currentCardKeys
            .map(k => new UICardInfo(k)).sort(CardInfo.compareCards) ?? []
    , [ctxState.gameContext.currentRoundState?.tableState.currentCardKeys]);

    const isLeftOpponentActive = useMemo(() =>
        ctxState.gameContext.currentRoundState?.leftOpponent.numberOfCards > 0
    , [ctxState.gameContext.currentRoundState?.leftOpponent.numberOfCards]);
    
    const isRightOpponentActive = useMemo(() =>
        ctxState.gameContext.currentRoundState?.rightOpponent.numberOfCards > 0
    , [ctxState.gameContext.currentRoundState?.rightOpponent.numberOfCards]);

    const onDragonSelection = useCallback((to: PlayerKey) => {
        const e: GiveDragonEvent = {
            eventType: ClientEventType.GIVE_DRAGON,
            data: {
                chosenOponentKey: to,
            }
        };
        ctxState.socket?.emit(ClientEventType.GIVE_DRAGON, e);
    }, [ctxState.socket]);

    const onDragonSelectionLeft = useCallback(() => {
        if (ctxState.gameContext.leftOpponent?.playerKey)
            onDragonSelection(ctxState.gameContext.leftOpponent.playerKey);
    }, [onDragonSelection, ctxState.gameContext.leftOpponent?.playerKey]);
    
    const onDragonSelectionRight = useCallback(() => {
        if (ctxState.gameContext.rightOpponent?.playerKey)
            onDragonSelection(ctxState.gameContext.rightOpponent.playerKey);
    }, [onDragonSelection, ctxState.gameContext.rightOpponent?.playerKey]);

    return (
        <div className={styles.tableBox}>
            <span className={styles.requestedCardTable}>{
                (requestedCardName === '') ?
                    '' : ('Requested: ' + requestedCardName)
            }</span>
            {
                isDragonSelectionPending ?
                <div className={styles.dragonSelectionTableContainer}>
                    <Card
                        key={SpecialCards.DRAGON} id={SpecialCards.DRAGON}
                        cardImg={cardImages.get('dragon')} alt={SpecialCards.DRAGON}
                    />                    
                    {
                        isLeftOpponentActive ?
                        <button
                            key='<-' id='<-'
                            onClick={onDragonSelectionLeft}
                            className={dragonSelection1}
                        >
                            {'<-'}
                        </button>
                        : ''
                    }
                    {
                        isRightOpponentActive ?
                        <button
                            key='->' id='->'
                            onClick={onDragonSelectionRight}
                            className={dragonSelection2}
                        >
                            {'->'}
                        </button>
                        : ''
                    }
                </div>
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
