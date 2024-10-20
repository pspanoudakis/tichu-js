import { NormalCardName } from "../game_logic/shared/CardConfig";
import { PlayerKey } from "../game_logic/shared/shared";
import { HiddenPlayerState, ThisPlayerState } from "./PlayerState";
import { TableState } from "./TableState";

export type GameRoundState = {
    thisPlayer: ThisPlayerState,
    teammate: HiddenPlayerState,
    leftOpponent: HiddenPlayerState,
    rightOpponent: HiddenPlayerState,
    requestedCardName?: NormalCardName,
    tableState: TableState,
    playerInTurnKey?: PlayerKey,
};
