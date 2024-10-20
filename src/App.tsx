import { Component } from 'react';
import { TichuGame } from './components/TichuGame';

import './styles/App.css';
import { AppRoot } from './components/AppRoot';

class App extends Component {
	render() {
		return (
		<div className="App-body">
			{/* <TichuGame/> */}
			<AppRoot/>
		</div>
		);
	}
}

export default App;
