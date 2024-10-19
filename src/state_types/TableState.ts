import { CardCombinationType } from "../game_logic/shared/shared";

export type TableState = {
    currentCardKeys?: string[],
    combinationType?: CardCombinationType,
    pendingDragonSelection: boolean,
};
