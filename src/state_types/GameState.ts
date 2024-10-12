import { z } from "zod";
import { GameRoundState } from "./GameRoundState";
import { PlayerKey, RoundScore } from "../shared/shared";

export type GameState = {
    thisPLayerKey: PlayerKey,
    currentRoundState?: GameRoundState,
    previousGames: RoundScore[],
    winningScore: number,
    gameOver: boolean,
};
