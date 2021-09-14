import { Component } from "react";
import { Gameboard } from "./Gameboard";
import { Scoreboard } from "./Scoreboard";

import * as styles from "../styles/Components.module.css"

export class TichuGame extends Component {

    state = {
        previousGames: [],
        team02TotalPoints: 0,
        team13TotalPoints: 0,
        winningScore: 0
    }

    updateScore = (team02, team13) => {
        this.setState({
            previousGames: [...this.state.previousGames, [team02, team13]],
            team02TotalPoints: this.state.team02TotalPoints + team02,
            team13TotalPoints: this.state.team13TotalPoints + team13
        });
    }

    render() {
        console.log(this.state.previousGames);
        return (
            <div className={styles.gameContainer}>
                <Scoreboard scores={this.state.previousGames}
                current={[this.state.team02TotalPoints, this.state.team13TotalPoints]}/>

                <Gameboard key={this.state.previousGames.length.toString()}
                gameRoundEnded={this.updateScore}/>
            </div>
        );
    }
}
