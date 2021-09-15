import { Component } from "react";
import { Gameboard } from "./Gameboard";
import { Scoreboard } from "./Scoreboard";

import * as styles from "../styles/Components.module.css"

export class TichuGame extends Component {

    state = {
        previousGames: [[200,0], [55,-66], [100,150], [1,2]],
        team02TotalPoints: 60,
        team13TotalPoints: 90,
        winningScore: 0
    }

    updateScore = (team02, team13) => {
        this.setState({
            previousGames: [...this.state.previousGames, [team02, team13]],
            team02TotalPoints: this.state.team02TotalPoints + team02,
            team13TotalPoints: this.state.team13TotalPoints + team13
        });
        // TODO: Check if game must end here, and make sure Gameboard does not restart.
        // Maybe "gameOver" prop?
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
