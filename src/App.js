import React, {Component} from 'react';
import './App.css';
//import {PlayerHand} from './components/PlayerHand'
//import {PersonSelector} from './components/PersonSelector'
import {Gameboard} from './components/Gameboard'

class App extends Component {
	render() {
		return (
		<div className="App-body">
			< Gameboard/>
		</div>
		);
	}
}

export default App;
