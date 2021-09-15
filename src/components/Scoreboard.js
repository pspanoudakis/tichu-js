import { Component } from "react";

import * as styles from "../styles/Components.module.css"

export class Scoreboard extends Component {
    
    state = {
        isExpanded: false
    }

    expandedScores = () => {
        if (this.props.scores.length === 0) {
            return <div className={styles.scoreboardExpanded}></div>
        }
        return <span></span>
    }

    toggleExpansion = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }

    render() {
        const items = (this.props.scores.length + 1);
        const mainStyles = [
            {
                width: '100%',
                height: items * 100 + '%',
                backgroundColor: 'rgb(80, 80, 80)',
                transform: 'translateY(-' + 100/items * this.props.scores.length + '%)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                zIndex: '1',
                transition: '500ms',
            },
            {
                width: '100%',
                //height: items * 100 * 0.75 + '%',
                height: items * 100 + '%',
                backgroundColor: 'rgb(80, 80, 80)',
                transform: 'translateY(0%)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                zIndex: '1',
                transition: '400ms',
            }
        ];

        return(
            <div style={this.state.isExpanded ? mainStyles[1] : mainStyles[0]} onClick={this.toggleExpansion}>
                <div className={styles.scoreboardEntry}>hello1</div>
                <div className={styles.scoreboardEntry}>hello2</div>
                <div className={styles.scoreboardEntry}>hello3</div>
                <div className={styles.scoreboardMainEntry}>Main</div>
            </div>
        );
    }
}
