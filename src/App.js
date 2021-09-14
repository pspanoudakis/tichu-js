import React, {Component} from 'react';
import './styles/App.css';
import { TichuGame } from './components/TichuGame';

class App extends Component {
	render() {
		return (
		<div className="App-body">
			<TichuGame/>
		</div>
		);
	}
}

export default App;
