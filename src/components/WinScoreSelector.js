import { Component, useState } from "react";

import * as styles from "../styles/Components.module.css"

const winningScores = [0, 500, 1000];
const options = winningScores.map( (score, index) =>
    <option value={score.toString()} key={index}>
        {score} 
    </option>
);

export const WinScoreSelector = (props) => {

    const [currentScoreSelection, setSelection] = useState("0");

    const makeSelection = (event) => {
        event.preventDefault();
        props.makeSelection(parseInt(currentScoreSelection));
    }

    const changeSelection = (event) => {
        setSelection(event.target.value);
    }

    return(
        <div className={styles.winScoreSelector}>
            Select winning score:
            <form onSubmit={makeSelection} className={styles.scoreSelectionForm}>
                <label>
                    <select value={currentScoreSelection} onChange={changeSelection}>
                        {options}
                    </select>
                </label>
                <input type="submit" value="Select"/>
            </form>
        </div>
    );
}

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

