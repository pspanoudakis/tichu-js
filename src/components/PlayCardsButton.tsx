import { useCallback, useContext } from "react";
import { AppContext } from "../AppContext";
import { NormalCardName } from "../game_logic/shared/CardConfig";
import { ClientEventType, PlayCardsEvent } from "../game_logic/shared/ClientEvents";

export const PlayCardsButton: React.FC<{
    cardSelections: {
        [s: string]: boolean;
    },
    phoenixAltName?: NormalCardName,
}> = ({ cardSelections, phoenixAltName }) => {

    const { state: ctxState } = useContext(AppContext);

    const onCardsPlayed = useCallback(() => {
        const e: PlayCardsEvent = {
            eventType: ClientEventType.PLAY_CARDS,
            data: {
                selectedCardKeys:
                    Object.keys(cardSelections).filter(k => cardSelections[k]),
                phoenixAltName,
            }
        };
        ctxState.socket?.emit(ClientEventType.PLAY_CARDS, e);
    }, [ctxState.socket, cardSelections, phoenixAltName]);

    const canPlayCards =
        (
            ctxState.gameContext.currentRoundState?.playerInTurnKey ===
            ctxState.gameContext.thisPlayer?.playerKey
        ) &&
        !ctxState.gameContext.currentRoundState?.tableState.pendingDragonSelection

    return (
        canPlayCards ?
        <button onClick={onCardsPlayed}>Play Cards</button>
        : null
    );
}
