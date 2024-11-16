import { PlayerBet } from "../game_logic/shared/shared"
import { BetIndicator } from "./BetIndicator"

import styles from "../styles/Components.module.css"

export const PlayerInfoHeader: React.FC<{
    nickname?: string,
    numCards?: number,
    bet?: PlayerBet
}> = (props) => {
    return (
        <div className={styles.playerInfo}>
            <span className={styles.playerIDSpan}>{
                props.nickname ?
                `${props.nickname} - Cards: ${props.numCards ?? 0}` : null
            }
            </span>
            <BetIndicator bet={props.bet}/>
        </div>
    );
}
