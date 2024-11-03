import { useCallback, useContext } from "react";
import { AppContext } from "../AppContext";
import { ClientEventType, PassTurnEvent } from "../game_logic/shared/ClientEvents";

export const PassTurnButton: React.FC<{}> = (props) => {

    const { state: ctxState } = useContext(AppContext);

    const onTurnPassed = useCallback(() => {
        const e: PassTurnEvent = {
            eventType: ClientEventType.PASS_TURN,
        };
        ctxState.socket?.emit(ClientEventType.PASS_TURN, e);
    }, [ctxState.socket]);

    return (
        <button onClick={onTurnPassed}>Pass Turn</button>
    );
}
