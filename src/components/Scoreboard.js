import { Component } from "react";

import * as styles from "../styles/Components.module.css"

export class Scoreboard extends Component {
    
    state = {
        isExpanded: false
    }

    expandedScores = () => {
        if (this.props.scores.length > 0) {
            return this.props.scores.map(([team02, team13]) => 
                <div className={styles.scoreboardEntry}>
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
        const mainStyles = [
            {
                width: '100%',
                height: 100 + 50 * innerEntries + '%',
                backgroundColor: 'rgb(80, 80, 80)',
                transform: 'translateY(-' + 100/(1 + innerEntries/2) * innerEntries/2  + '%)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                zIndex: '1',
                transition: '400ms',
            },
            {
                width: '100%',
                height: 100 + 50 * innerEntries + '%',
                backgroundColor: 'rgb(80, 80, 80)',
                transform: 'translateY(0%)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                zIndex: '1',
                transition: '400ms',
            }
        ];

        return (
            <div style={this.state.isExpanded ? mainStyles[1] : mainStyles[0]} onClick={this.toggleExpansion}>
                {this.expandedScores()}
                <div className={styles.scoreboardMainEntry}>
                    <span className={styles.mainScore}>
                        <span style={{fontSize: 'large'}}>Team 1-3</span>
                        {this.props.current[0]}
                    </span> 
                    <span className={styles.mainScore}>
                        <span style={{fontSize: 'large'}}>Team 2-4</span>
                        {this.props.current[1]}
                    </span>
                </div>
            </div>
        );
    }
}
