import { NormalCardName, PlayerKey } from "../game_logic/shared/shared";
import { HiddenPlayerState, ThisPlayerState } from "./PlayerState";
import { TableState } from "./TableState";

export type GameRoundState = {
    thisPlayer: ThisPlayerState,
    teammate: HiddenPlayerState,
    leftOpponent: HiddenPlayerState,
    RightOpponent: HiddenPlayerState,
    requestedCardName?: NormalCardName,
    tableState: TableState,
    playerInTurnKey?: PlayerKey,
    pendingDragonDecision: boolean,
};
