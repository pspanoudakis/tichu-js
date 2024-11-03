import { useCallback, useContext } from "react";
import { AppContext } from "../AppContext";
import { ClientEventType, DropBombEvent } from "../game_logic/shared/ClientEvents";

export const DropBombButton: React.FC<{}> = (props) => {

    const { state: ctxState } = useContext(AppContext);

    const onBombDropped = useCallback(() => {
        const e: DropBombEvent = {
            eventType: ClientEventType.DROP_BOMB,
        };
        ctxState.socket?.emit(ClientEventType.DROP_BOMB, e);
    }, [ctxState.socket]);

    return (
        <button onClick={onBombDropped}>Bomb</button>
    );
}
