import { Component } from "react";

import * as styles from "../styles/Components.module.css"

export class Scoreboard extends Component {

    expandedScores = () => {
        if (this.props.scores.length === 0) {
            return <div className={styles.scoreboardExpanded}></div>
        }
        return <span></span>
    }

    render() {
        return(
            <div className={styles.scoreboardStyle}>
                {this.expandedScores()}
            </div>
        );
    }
}
