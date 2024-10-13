import { PlayerBet, PlayerKey } from "../shared/shared"

export type PlayerInfoState = {
    playerKey: PlayerKey,
    playerIndex: number,
    nickname: string,
};

type PlayerRoundStateBase = {
    playerKey: PlayerKey
    playerBet: PlayerBet,
    pendingBomb: boolean,
}

export const createInitialPlayerInfoState = (
    playerKey: PlayerKey,
    playerIndex: number,
    nickname: string
): PlayerInfoState => ({
    playerKey,
    playerIndex,
    nickname,
});

const createInitialPlayerRoundStateBase = (
    playerKey: PlayerKey,
): PlayerRoundStateBase => ({
    playerKey,
    playerBet: PlayerBet.NONE,
    pendingBomb: false,
});

export type HiddenPlayerState = PlayerRoundStateBase & {
    numberOfCards: number,
};

export const createInitialThisPlayerState = (
    playerKey: PlayerKey,
): ThisPlayerState => ({
    ...createInitialPlayerRoundStateBase(playerKey),
    cardKeys: []
});

export type ThisPlayerState = PlayerRoundStateBase & {
    cardKeys: string[],
};

export const createInitialHiddenPlayerState = (
    playerKey: PlayerKey,
): HiddenPlayerState => ({
    ...createInitialPlayerRoundStateBase(playerKey),
    numberOfCards: 0,
});
