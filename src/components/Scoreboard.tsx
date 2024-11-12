import React, {
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";

import styles from "../styles/Components.module.css"
import { scoreboardMainEntryClass, scoreboardNormalEntryClass } from "./styleUtils";
import { RoundScore, TEAM_KEYS, TEAM_PLAYERS } from "../game_logic/shared/shared";
import { AppContext } from "../AppContext";

export const Scoreboard: React.FC<{
    current: RoundScore,
    scores: RoundScore[]
}> = (props) => {

    const { state: ctxState } = useContext(AppContext);
    const thisPlayerKey = ctxState.gameContext.thisPlayer?.playerKey;

    const { myTeamProperty, oppositeTeamProperty }: {
        myTeamProperty: keyof RoundScore,
        oppositeTeamProperty: keyof RoundScore,
    } = useMemo(() => {
        if (!thisPlayerKey || TEAM_PLAYERS[TEAM_KEYS.TEAM_02].includes(thisPlayerKey)) {
            return {
                myTeamProperty: 'team02',
                oppositeTeamProperty: 'team13',
            }
        } else {
            return {
                myTeamProperty: 'team13',
                oppositeTeamProperty: 'team02'
            }
        }
    }, [thisPlayerKey])

    const [isExpanded, setIsExpanded] = useState(false);

    const expandedScores = useCallback(() => {
        if (props.scores.length > 0) {
            return props.scores.map((s, index) => 
                <div key={index} className={scoreboardNormalEntryClass}>
                    <div className={styles.innerScore}>{s[myTeamProperty]}</div> 
                    <div className={styles.innerScore}>{s[oppositeTeamProperty]}</div>
                </div>
            )
        }
        return <span></span>;
    }, [props.scores, myTeamProperty, oppositeTeamProperty])

    const toggleExpansion = useCallback(() => {
        if (props.scores.length > 0) {
            setIsExpanded(e => !e);
        }
    }, [props.scores.length])

    const mainStyles = useMemo(() => {
        const innerEntries = props.scores.length;
        const styleSkeleton = {
            width: '100%',
            height: 100 + 50 * innerEntries + '%',
            backgroundColor: 'rgb(80, 80, 80)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
            zIndex: '1',
            transition: '400ms',
        }
        let mainStyles = [
            { transform: 'translateY(-' + 100/(1 + innerEntries/2) * innerEntries/2  + '%)' },
            { transform: 'translateY(0%)' }
        ];
        Object.assign(mainStyles[0], styleSkeleton);
        Object.assign(mainStyles[1], styleSkeleton);
        return mainStyles;
    }, [props.scores.length]);    
        
    return (
        <div style={isExpanded ? mainStyles[1] : mainStyles[0]} onClick={toggleExpansion}>
            {expandedScores()}
            <div className={scoreboardMainEntryClass}>
                <span className={styles.mainScore}>
                    <span style={{fontSize: '2vh'}}>My Team</span>
                    {props.current[myTeamProperty]}
                </span> 
                <span className={styles.mainScore}>
                    <span style={{fontSize: '2vh'}}>Opposite Team</span>
                    {props.current[oppositeTeamProperty]}
                </span>
            </div>
        </div>
    );
}
