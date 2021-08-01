import React, {Component} from 'react';
import './App.css';
import {PlayerHand} from './components/PlayerHand'
//import {PersonSelector} from './components/PersonSelector'

class App extends Component {
	render() {
		return (
		<div className="App-body">
			<PlayerHand />
		</div>
		);
	}
}

export default App;
