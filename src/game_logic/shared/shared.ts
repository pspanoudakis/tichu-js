import { z } from "zod";

/** Possible card combination types. */
export enum CardCombinationType {
    KENTA = 'Kenta',
    FULLHOUSE = 'FullHouse',
    STEPS = 'Steps',
    TRIPLET = 'Triplet',
    COUPLE = 'Couple',
    SINGLE = 'Single',
    BOMB = 'Bomb'
}

/** Possible player bet points */
export enum PlayerBet {
    NONE = 0,
    TICHU = 100,
    GRAND_TICHU = 200
}

const _PLAYER_KEYS = {
    PLAYER1: 'player1',
    PLAYER2: 'player2',
    PLAYER3: 'player3',
    PLAYER4: 'player4',
} as const;

export const PLAYER_KEYS = [
    ...Object.values(_PLAYER_KEYS)
] as const;

export const zPlayerKey = z.nativeEnum(_PLAYER_KEYS);
export type PlayerKey = z.infer<typeof zPlayerKey>;

export const TEAM_KEYS = {
    TEAM_02: 'TEAM_02',
    TEAM_13: 'TEAM_13',
} as const;

export const zTeamKeySchema = z.nativeEnum(TEAM_KEYS);

export const zCreateRoomRequest = z.object({
    winningScore: z.number()
});
export type CreateRoomRequest = z.infer<typeof zCreateRoomRequest>;

export const zSessionIdResponse = z.object({
    sessionId: z.string(),
});
export type SessionIdResponse = z.infer<typeof zSessionIdResponse>;

export const ERROR_TYPES = {
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

export const zErrorResponse = z.object({
    errorType: z.nativeEnum(ERROR_TYPES),
    message: z.string(),
});
export type ErrorResponse = z.infer<typeof zErrorResponse>;

export const zRoundScore = z.object({
    team02: z.number(),
    team13: z.number(),
});
export type RoundScore = z.infer<typeof zRoundScore>;

export const zGameWinnerResult = z.union([
    zTeamKeySchema, z.literal('TIE')
]);
export type GameWinnerResult = z.infer<typeof zGameWinnerResult>;
