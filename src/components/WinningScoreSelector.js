import { Component } from "react";

import * as styles from "../styles/Components.module.css"

const winningScores = [0, 500, 1000];
const options = winningScores.map(
    (score, index) =>   <option value={score.toString()} key={index}>
                            {score} 
                        </option>
);

export class WinningScoreSelector extends Component {
    state = {
        currentScoreSelection: "0"
    }

    makeSelection = (event) => {
        event.preventDefault();
        this.props.makeSelection(parseInt(this.state.currentScoreSelection));
    }

    changeSelection = (event) => {
        this.setState({
            currentScoreSelection: event.target.value
        });
    }

    render() {
        return(
            <div className={styles.winScoreSelector}>
                Select winning score:
                <form onSubmit={this.makeSelection} className={styles.scoreSelectionForm}>
                    <label>
                        <select value={this.state.currentScoreSelection} onChange={this.changeSelection}>
                            {options}
                        </select>
                    </label>
                    <input type="submit" value="Select"/>
                </form>
            </div>
        );
    }
}
