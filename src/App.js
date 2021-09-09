import React, {Component} from 'react';
import './styles/App.css';
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
