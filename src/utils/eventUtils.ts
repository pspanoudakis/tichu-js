import { Socket } from "socket.io-client";
import { EventsMap } from "@socket.io/component-emitter";
import { zErrorEvent } from "../game_logic/shared/ServerEvents";
import { ERROR_TYPES } from "../game_logic/shared/shared";

export function logError(msg?: any, ...optionals: any[]) {
    console.error(msg, ...optionals);
    alert(`${msg}. See console.`);
}

export function eventHandlerWrapper<EventType>(
    validator: (e: any) => EventType,
    eventHandler: (e: EventType) => void,
) {
    return (event: any) => {
        let e;
        try {
            e = validator(event);
        } catch (error) {
            return logError('Validation Error', error);
        }
        try {
            eventHandler(e);
        } catch (error) {
            return logError('Error in event handler', error);
        }
    };
}

export function registerEventListenersHelper<
    ListenEvents extends EventsMap,
    EmitEvents extends EventsMap,
>(
    eventListeners: Partial<ListenEvents>,
    socket?: Socket<ListenEvents, EmitEvents>
) {
    if (!socket) return () => {};
    for (const eventName in eventListeners) {
        const l = eventListeners[eventName];
        //@ts-ignore
        if (l) socket.on(eventName, l);
    }
    return () => {
        for (const eventName in eventListeners) {
            socket.off(eventName, eventListeners[eventName]);
        }
    };
}

const errorEventListener = eventHandlerWrapper(
    zErrorEvent.parse, e => {
        console.error(e);
        alert(`'${e.eventType}' event received. See console for details.`);
    }
);

export const errorEventListeners: {
    [et in keyof typeof ERROR_TYPES]: typeof errorEventListener
} = {
    [ERROR_TYPES.BUSINESS_ERROR]: eventHandlerWrapper(
        zErrorEvent.parse, e => {
            console.error(e);
            alert(e.data.message);
        }
    ),
    [ERROR_TYPES.INTERNAL_ERROR]: errorEventListener,
    [ERROR_TYPES.VALIDATION_ERROR]: errorEventListener,
};
