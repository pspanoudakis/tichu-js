import { z } from "zod";
import { createGameEventSchema } from "./GameEvent";
import { PlayerBet, zPlayerKey } from "./shared";
import { zCardKey, zCardName } from "./CardConfig";

export const ClientEventType =  {
    JOIN_GAME: 'JOIN_GAME',
    PLAY_CARDS: 'PLAY_CARDS',
    PASS_TURN: 'PASS_TURN',
    TRADE_CARDS: 'TRADE_CARDS',
    RECEIVE_TRADE: 'RECEIVE_TRADE',
    GIVE_DRAGON: 'GIVE_DRAGON',
    REVEAL_ALL_CARDS: 'REVEAL_ALL_CARDS',
    PLACE_BET: 'PLACE_BET',
    DROP_BOMB: 'DROP_BOMB',
    REQUEST_CARD: 'REQUEST_CARD',
    SEND_MESSAGE: 'SEND_MESSAGE',
} as const;

export const zJoinGameEvent = createGameEventSchema(
    z.literal(ClientEventType.JOIN_GAME),
    z.object({
        playerNickname: z.string(),
    }),
)
export type JoinGameEvent = z.infer<typeof zJoinGameEvent>;

export const zPlayCardsEvent = createGameEventSchema(
    z.literal(ClientEventType.PLAY_CARDS),
    z.object({
        selectedCardKeys: z.array(zCardKey),
        phoenixAltName: zCardName.optional()
    })
)
export type PlayCardsEvent = z.infer<typeof zPlayCardsEvent>;

export const zPassTurnEvent =
    createGameEventSchema(z.literal(ClientEventType.PASS_TURN));
export type PassTurnEvent = z.infer<typeof zPassTurnEvent>;

export const zTradeCardsEvent = createGameEventSchema(
    z.literal(ClientEventType.TRADE_CARDS),
    z.object({
        teammateCardKey: zCardKey,
        leftCardKey: zCardKey,
        rightCardKey: zCardKey,
    })
);
export type TradeCardsEvent = z.infer<typeof zTradeCardsEvent>;

export const zReceiveTradeEvent = createGameEventSchema(
    z.literal(ClientEventType.RECEIVE_TRADE)
);
export type ReceiveTradeEvent = z.infer<typeof zReceiveTradeEvent>;

export const zGiveDragonEvent = createGameEventSchema(
    z.literal(ClientEventType.GIVE_DRAGON),
    z.object({
        chosenOponentKey: zPlayerKey,
    })
);
export type GiveDragonEvent = z.infer<typeof zGiveDragonEvent>

export const zRevealAllCardsEvent = createGameEventSchema(
    z.literal(ClientEventType.REVEAL_ALL_CARDS)
);
export type RevealAllCardsEvent = z.infer<typeof zRevealAllCardsEvent>;

export const zPlaceBetEvent = createGameEventSchema(
    z.literal(ClientEventType.PLACE_BET),
    z.object({
        betPoints: z.union([
            z.literal(PlayerBet.TICHU),
            z.literal(PlayerBet.GRAND_TICHU)
        ]),
    })
)
export type PlaceBetEvent = z.infer<typeof zPlaceBetEvent>;

export const zDropBombEvent =
    createGameEventSchema(z.literal(ClientEventType.DROP_BOMB));
export type DropBombEvent = z.infer<typeof zDropBombEvent>;

export const zRequestCardEvent = createGameEventSchema(
    z.literal(ClientEventType.REQUEST_CARD),
    z.object({
        requestedCardName: zCardName,
    })
)
export type RequestCardEvent = z.infer<typeof zRequestCardEvent>;

export const zSendMessageEvent = createGameEventSchema(
    z.literal(ClientEventType.SEND_MESSAGE),
    z.object({
        text: z.string(),
    })
);
export type SendMessageEvent = z.infer<typeof zSendMessageEvent>;
