import { Component } from 'react';
import { TichuGame } from './components/TichuGame';

import './styles/App.css';

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
