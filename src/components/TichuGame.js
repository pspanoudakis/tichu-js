import { Component } from "react";
import { Gameboard } from "./Gameboard";
import { Scoreboard } from "./Scoreboard";
import { GameLogic } from "../GameLogic";
import { WinningScoreSelector } from "./WinningScoreSelector";

import * as styles from "../styles/Components.module.css"

export class TichuGame extends Component {

    state = {
        /*
        previousGames: [[200,0], [55,45], [-25,125]],
        team02TotalPoints: 230,
        team13TotalPoints: 170,
        */
        previousGames: [],
        team02TotalPoints: 0,
        team13TotalPoints: 0,
        winningScore: 0,
        winScoreSelected: false,
        gameOver: false
    }

    setWinningScore = (score) => {
        this.setState({
            winningScore: score,
            winScoreSelected: true
        });
    }

    updateScore = (team02, team13) => {
        let newState = {
            previousGames: [...this.state.previousGames, [team02, team13]],
            team02TotalPoints: this.state.team02TotalPoints + team02,
            team13TotalPoints: this.state.team13TotalPoints + team13,
            winningScore: this.state.winningScore,
            gameOver: false
        }
        if (GameLogic.gameShouldEnd(newState)) {
            newState.gameOver = true;
            window.alert('Game over');
        }
        this.setState(newState);
    }

    render() {
        if (this.state.winScoreSelected) {
            return (
                <div className={styles.gameContainer}>
                    <Scoreboard scores={this.state.previousGames}
                    current={[this.state.team02TotalPoints, this.state.team13TotalPoints]}/>
    
                    <Gameboard key={this.state.previousGames.length.toString()}
                    gameRoundEnded={this.updateScore} gameOver={this.state.gameOver}/>
                </div>
            );
        }
        return <WinningScoreSelector makeSelection={this.setWinningScore}/>;
    }
}
