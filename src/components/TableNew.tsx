import React, { useContext, useEffect } from "react";
import { AppContext, handleBombDroppedEvent, handleCardsPlayedEvent } from "../AppContext";
import { eventHandlerWrapper, registerEventListenersHelper } from "../utils/eventUtils";
import { ServerEventType, zBombDroppedEvent, zCardRequestedEvent, zCardsPlayedEvent, zDragonGivenEvent, zPendingDragonDecisionEvent, zTurnPassedEvent } from "../game_logic/shared/ServerEvents";

export const TableNew: React.FC<{

}> = (props) => {

    const { state: ctxState, setState: setCtxState } = useContext(AppContext);

    useEffect(registerEventListenersHelper({
        [ServerEventType.CARDS_PLAYED]: eventHandlerWrapper(
            zCardsPlayedEvent.parse, e => {
                handleCardsPlayedEvent(e, setCtxState);
            }
        ),
        [ServerEventType.TURN_PASSED]: eventHandlerWrapper(
            zTurnPassedEvent.parse, e => {

            }
        ),
        [ServerEventType.CARD_REQUESTED]: eventHandlerWrapper(
            zCardRequestedEvent.parse, e => {

            }
        ),
        [ServerEventType.PENDING_DRAGON_DECISION]: eventHandlerWrapper(
            zPendingDragonDecisionEvent.parse, e => {

            }
        ),
        [ServerEventType.DRAGON_GIVEN]: eventHandlerWrapper(
            zDragonGivenEvent.parse, e => {

            }
        ),
        [ServerEventType.BOMB_DROPPED]: eventHandlerWrapper(
            zBombDroppedEvent.parse, e => {
                handleBombDroppedEvent(e, setCtxState);
            }
        ),
    }, ctxState.socket), [ctxState.socket])

    return null;
};
