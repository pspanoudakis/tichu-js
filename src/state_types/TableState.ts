import { CardCombinationType } from "../shared/shared";

export type TableState = {
    currentCardKeys?: string[],
    combinationType?: CardCombinationType,
    pendingDragonSelection: boolean,
};
