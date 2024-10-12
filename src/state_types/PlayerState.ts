import { PlayerBet, PlayerKey } from "../shared/shared"

export type PlayerStateBase = {
    playerKey: PlayerKey,
    nickname: string,
    playerBet: PlayerBet,
    pendingBomb: boolean,
};

export type HiddenPlayerState = PlayerStateBase & {
    numberOfCards: number,
};

export type ThisPlayerState = PlayerStateBase & {
    cardKeys: string[],
};
