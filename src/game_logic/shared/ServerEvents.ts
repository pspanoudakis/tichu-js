import { z } from "zod";
import { createGameEventSchema } from "./GameEvent";
import {
    CardCombinationType,
    ERROR_TYPES,
    PLAYER_KEYS,
    PlayerBet,
    PlayerKey,
    zGameWinnerResult,
    zPlayerKey,
    zRoundScore
} from "./shared";
import { zCardKey, zCardName } from "./CardConfig";

export const ServerEventType = {
    WAITING_4_JOIN: 'WAITING_4_JOIN',
    ROOM_CREATED: 'ROOM_CREATED',
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_LEFT: 'PLAYER_LEFT',
    ALL_CARDS_REVEALED: 'ALL_CARDS_REVEALED',
    CARDS_PLAYED: 'CARDS_PLAYED',
    TURN_PASSED: 'TURN_PASSED',
    CARDS_TRADED: 'CARDS_TRADED',
    PENDING_DRAGON_DECISION: 'PENDING_DRAGON_DECISION',
    DRAGON_GIVEN: 'DRAGON_GIVEN',
    BET_PLACED: 'BET_PLACED',
    BOMB_DROPPED: 'BOMB_DROPPED',
    CARD_REQUESTED: 'CARD_REQUESTED',
    MESSAGE_SENT: 'MESSAGE_SENT',
    TABLE_ROUND_STARTED: 'TABLE_ROUND_STARTED',
    TABLE_ROUND_ENDED: 'TABLE_ROUND_ENDED',
    GAME_ROUND_STARTED: 'GAME_ROUND_STARTED',
    GAME_ROUND_ENDED: 'GAME_ROUND_ENDED',
    GAME_ENDED: 'GAME_ENDED',
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    UNKNOWN_SERVER_ERROR: 'UNKNOWN_SERVER_ERROR',
    CLIENT_STATE_SYNC: 'CLIENT_STATE_SYNC',
} as const;

export const zWaitingForJoinEvent = createGameEventSchema(
    z.literal(ServerEventType.WAITING_4_JOIN),
    z.object({
        presentPlayers: z.object<{
            [playerKey in PlayerKey] : z.ZodOptional<z.ZodString>
        }>({
            player1: z.string().optional(),
            player2: z.string().optional(),
            player3: z.string().optional(),
            player4: z.string().optional(),
        }),
        winningScore: z.number(),
    }),
    zPlayerKey,
);
export type WaitingForJoinEvent = z.infer<typeof zWaitingForJoinEvent>;

export const zPlayerJoinedEvent = createGameEventSchema(
    z.literal(ServerEventType.PLAYER_JOINED),
    z.object({
        playerNickname: z.string(),
    }),
    zPlayerKey,
)
export type PlayerJoinedEvent = z.infer<typeof zPlayerJoinedEvent>;

export const zPlayerLeftEvent = createGameEventSchema(
    z.literal(ServerEventType.PLAYER_LEFT),
    z.undefined(),
    zPlayerKey,
);
export type PlayerLeftEvent = z.infer<typeof zPlayerLeftEvent>;

export const zAllCardsRevealedEvent = createGameEventSchema(
    z.literal(ServerEventType.ALL_CARDS_REVEALED),
    z.object({
        cards: z.array(zCardKey),
    })
);
export type AllCardsRevealedEvent = z.infer<typeof zAllCardsRevealedEvent>;

export const zCardsPlayedEvent = createGameEventSchema(
    z.literal(ServerEventType.CARDS_PLAYED),
    z.object({
        numCardsRemainingInHand: z.number(),
        combinationType: z.nativeEnum(CardCombinationType),
        tableCardKeys: z.array(zCardKey),
        requestedCardName: z.optional(z.string()),
    }),
    zPlayerKey,
);
export type CardsPlayedEvent = z.infer<typeof zCardsPlayedEvent>;

export const zTurnPassedEvent = createGameEventSchema(
    z.literal(ServerEventType.TURN_PASSED),
    z.undefined(),
    zPlayerKey,
);
export type TurnPassedEvent = z.infer<typeof zTurnPassedEvent>;

export const zCardsTradedEvent = createGameEventSchema(
    z.literal(ServerEventType.CARDS_TRADED),
    z.object({
        cardByTeammate: zCardKey,
        cardByLeft: zCardKey,
        cardByRight: zCardKey,
    })
);
export type CardsTradedEvent = z.infer<typeof zCardsTradedEvent>;

export const zPendingDragonDecisionEvent = createGameEventSchema(
    z.literal(ServerEventType.PENDING_DRAGON_DECISION)
);
export type PendingDragonDecisionEvent =
    z.infer<typeof zPendingDragonDecisionEvent>;

export const zDragonGivenEvent = createGameEventSchema(
    z.literal(ServerEventType.DRAGON_GIVEN),
    z.object({
        dragonReceiverKey: zPlayerKey,
    })
);
export type DragonGivenEvent = z.infer<typeof zDragonGivenEvent>;

export const zBetPlacedEvent = createGameEventSchema(
    z.literal(ServerEventType.BET_PLACED),
    z.object({
        betPoints: z.union([
            z.literal(PlayerBet.TICHU),
            z.literal(PlayerBet.GRAND_TICHU)
        ]),
    }),
    zPlayerKey,
)
export type BetPlacedEvent = z.infer<typeof zBetPlacedEvent>;

export const zBombDroppedEvent = createGameEventSchema(
    z.literal(ServerEventType.BOMB_DROPPED),
    z.undefined(),
    zPlayerKey,
);
export type BombDroppedEvent = z.infer<typeof zBombDroppedEvent>;

export const zCardRequestedEvent = createGameEventSchema(
    z.literal(ServerEventType.CARD_REQUESTED),
    z.object({
        requestedCardName: zCardName,
    }),
    zPlayerKey,
)
export type CardRequestedEvent = z.infer<typeof zCardRequestedEvent>;

export const zMessageSentEvent = createGameEventSchema(
    z.literal(ServerEventType.MESSAGE_SENT),
    z.object({
        sentBy: z.string(),
        sentOn: z.string(),
        text: z.string(),
    }),
    zPlayerKey,
);
export type MessageSentEvent = z.infer<typeof zMessageSentEvent>;

export const zTableRoundStartedEvent = createGameEventSchema(
    z.literal(ServerEventType.TABLE_ROUND_STARTED),
    z.object({
        currentPlayer: zPlayerKey,
    })
);
export type TableRoundStartedEvent = z.infer<typeof zTableRoundStartedEvent>;

export const zTableRoundEndedEvent = createGameEventSchema(
    z.literal(ServerEventType.TABLE_ROUND_ENDED),
    z.object({
        roundWinner: zPlayerKey,
    })
);
export type TableRoundEndedEvent = z.infer<typeof zTableRoundEndedEvent>;

export const zGameRoundStartedEvent = createGameEventSchema(
    z.literal(ServerEventType.GAME_ROUND_STARTED),
    z.object({
        partialCards: z.array(zCardKey),
    })
);
export type GameRoundStartedEvent = z.infer<typeof zGameRoundStartedEvent>;

export const zGameRoundEndedEvent = createGameEventSchema(
    z.literal(ServerEventType.GAME_ROUND_ENDED),
    z.object({
        roundScore: zRoundScore,
    })
);
export type GameRoundEndedEvent = z.infer<typeof zGameRoundEndedEvent>;

export const zGameEndedEvent = createGameEventSchema(
    z.literal(ServerEventType.GAME_ENDED),
    z.object({
        result: zGameWinnerResult,
        team02TotalScore: z.number(),
        team13TotalScore: z.number(),
        scores: z.array(zRoundScore),
    })
);
export type GameEndedEvent = z.infer<typeof zGameEndedEvent>;

export const zErrorEvent = createGameEventSchema(
    z.nativeEnum(ERROR_TYPES),
    z.object({
        message: z.string(),
    })
);
export type ErrorEvent = z.infer<typeof zErrorEvent>;

export const zClientStateSyncEvent = createGameEventSchema(
    z.literal(ServerEventType.CLIENT_STATE_SYNC),
    z.object({

    })
);
export type ClientStateSyncEvent = z.infer<typeof zClientStateSyncEvent>;

export const zServerEvent = z.union([
    zWaitingForJoinEvent,
    zPlayerJoinedEvent,
    zPlayerLeftEvent,
    zAllCardsRevealedEvent,
    zCardsPlayedEvent,
    zTurnPassedEvent,
    zCardsTradedEvent,
    zPendingDragonDecisionEvent,
    zDragonGivenEvent,
    zBetPlacedEvent,
    zBombDroppedEvent,
    zCardRequestedEvent,
    zMessageSentEvent,
    zTableRoundStartedEvent,
    zTableRoundEndedEvent,
    zGameRoundStartedEvent,
    zGameRoundEndedEvent,
    zGameEndedEvent,
    zErrorEvent,
    zClientStateSyncEvent,

])
export type ServerEvent = z.infer<typeof zServerEvent>;
