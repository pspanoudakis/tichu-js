import { CardCombinationType, PlayerKey } from "../game_logic/shared/shared";

export type TableState = {
    currentCardKeys?: string[],
    combinationType?: CardCombinationType,
    pendingDragonSelection: boolean,
    pendingBomb: boolean,
    currentCardsOwner?: PlayerKey,
};
