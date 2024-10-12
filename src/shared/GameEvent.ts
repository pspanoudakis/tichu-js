import { z } from "zod";
import { PlayerKey, zPlayerKey } from "./shared";

export function createGameEventSchema<
    EventType extends z.ZodTypeAny,
    DataType extends z.ZodTypeAny
>(
    eventTypeSchema: EventType,
    dataTypeSchema: DataType
) {
    return z.object({
        playerKey: z.optional(zPlayerKey),
        eventType: eventTypeSchema,
        data: dataTypeSchema,
    });
};
export function createEmptyGameEventSchema<EventType extends z.ZodTypeAny>
(eventTypeSchema: EventType) {
    return z.object({
        playerKey: z.optional(zPlayerKey),
        eventType: eventTypeSchema
    });
};

export type GameEvent<T, D = void> = {
    playerKey?: PlayerKey,
    eventType: T,
} & (
    D extends void ? { data?: never } : { data: D }
);
