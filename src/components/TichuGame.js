import { Component } from "react";
import { Gameboard } from "./Gameboard";
import { Scoreboard } from "./Scoreboard";
import { GameLogic } from "../GameLogic";
import { WinScoreSelector } from "./WinScoreSelector";
import { GenericCheckbox } from "./GenericCheckbox";

import * as styles from "../styles/Components.module.css"
import tichuLogo from "../res/tichu_logo.png"

export class TichuGame extends Component {

    state = {
        previousGames: [],
        team02TotalPoints: 0,
        team13TotalPoints: 0,
        winningScore: 0,
        winScoreSelected: false,
        gameOver: false,
        showcaseScoreboard: true
    }

    setShowcaseScoreboard = (value) => {
        console.log(value);
        this.setState({
            showcaseScoreboard: value
        });
    }

    setWinningScore = (score) => {
        let previousGames = [];
        let team02TotalPoints = 0;
        let team13TotalPoints = 0;
        if (this.state.showcaseScoreboard) {
            previousGames = [[200,0], [55,45], [-25,125]];
            team02TotalPoints = 230;
            team13TotalPoints = 170;
        }
        this.setState({
            previousGames: previousGames,
            team02TotalPoints: team02TotalPoints,
            team13TotalPoints: team13TotalPoints,
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
        return (
            <div className={styles.enteringSceneContainer}>
                <img src={tichuLogo} alt={"Oops, let's pretend this is the logo :("}
                className={styles.gameLogo}/>
                <WinScoreSelector makeSelection={this.setWinningScore}/>
                <GenericCheckbox text={"Showcase scoreboard"} callback={this.setShowcaseScoreboard}/>
            </div>
        );
    }
}
