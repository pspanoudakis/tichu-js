import { NormalCardName } from "../game_logic/shared/CardConfig";
import { PlayerKey } from "../game_logic/shared/shared";
import { PlayerRoundStateBase, ThisPlayerState } from "./PlayerState";
import { TableState } from "./TableState";

type GameRoundPhase = 'TRADES' | 'MAIN' | 'OVER';

export type GameRoundState = {
    currentPhase: GameRoundPhase,
    thisPlayer: ThisPlayerState,
    teammate: PlayerRoundStateBase,
    leftOpponent: PlayerRoundStateBase,
    rightOpponent: PlayerRoundStateBase,
    requestedCardName?: NormalCardName,
    tableState: TableState,
    playerInTurnKey?: PlayerKey,
};
