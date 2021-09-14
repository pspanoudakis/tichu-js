import { Component } from "react";
import { Gameboard } from "./Gameboard";

export class TichuGame extends Component {

    state = {
        previousGames: [],
        team02Points: 0,
        team13Points: 0
    }

    updateScore = (team02, team13) => {
        this.setState({
            previousGames: [...this.state.previousGames, [team02, team13]],
            team02Points: this.state.team02Points + team02,
            team13Points: this.state.team13Points + team13
        });
    }

    render() {
        console.log(this.state.previousGames);
        return <Gameboard key={this.state.previousGames.length.toString()} gameRoundEnded={this.updateScore}/>;
    }
}