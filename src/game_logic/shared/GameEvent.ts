import { z } from "zod";
import { PlayerKey, zPlayerKey } from "./shared";

export function createGameEventSchema<
    EventType extends z.ZodTypeAny,
    DataType extends z.ZodTypeAny,
    PlayerKeyType extends typeof zPlayerKey | z.ZodUndefined,
>(
    eventTypeSchema: EventType,
    dataTypeSchema: DataType = z.undefined() as DataType,
    playerKeySchema: PlayerKeyType = z.undefined() as PlayerKeyType,
) {
    return z.object({
        playerKey: playerKeySchema,
        eventType: eventTypeSchema,
        data: dataTypeSchema,
    });
};

export type GameEvent<T, D = void> = {
    playerKey?: PlayerKey,
    eventType: T,
} & (
    D extends void ? { data?: never } : { data: D }
);
