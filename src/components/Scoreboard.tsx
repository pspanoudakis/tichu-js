import { Component } from "react";

import styles from "../styles/Components.module.css"
import { scoreboardMainEntryClass, scoreboardNormalEntryClass } from "./styleUtils";
import { RoundScore } from "../shared/shared";

export class Scoreboard extends Component<{
    current: RoundScore,
    scores: RoundScore[]
}> {
    
    state = {
        isExpanded: false
    }

    expandedScores = () => {
        if (this.props.scores.length > 0) {
            return this.props.scores.map(({team02, team13}, index) => 
                <div key={index} className={scoreboardNormalEntryClass}>
                    <div className={styles.innerScore}>{team02}</div> 
                    <div className={styles.innerScore}>{team13}</div>
                </div>
            )
        }
        return <span></span>;
    }

    toggleExpansion = () => {
        if (this.props.scores.length > 0) {
            this.setState({
                isExpanded: !this.state.isExpanded
            });
        }
    }

    render() {
        const innerEntries = this.props.scores.length;
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
        
        return (
            <div style={this.state.isExpanded ? mainStyles[1] : mainStyles[0]} onClick={this.toggleExpansion}>
                {this.expandedScores()}
                <div className={scoreboardMainEntryClass}>
                    <span className={styles.mainScore}>
                        <span style={{fontSize: '2vh'}}>Team 1-3</span>
                        {this.props.current.team02}
                    </span> 
                    <span className={styles.mainScore}>
                        <span style={{fontSize: '2vh'}}>Team 2-4</span>
                        {this.props.current.team02}
                    </span>
                </div>
            </div>
        );
    }
}
