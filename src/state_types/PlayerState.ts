import { PlayerBet, PlayerKey } from "../game_logic/shared/shared"

export type PlayerInfoState = {
    playerKey: PlayerKey,
    playerIndex: number,
    nickname: string,
};

export type PlayerRoundStateBase = {
    playerKey: PlayerKey
    playerBet: PlayerBet,
    pendingBomb: boolean,
    numberOfCards: number,
}

export const createInitialPlayerInfoState = (
    playerKey: PlayerKey,
    playerIndex: number,
    nickname: string,
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
    numberOfCards: 0,
});

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
): PlayerRoundStateBase => ({
    ...createInitialPlayerRoundStateBase(playerKey),
    numberOfCards: 0,
});
