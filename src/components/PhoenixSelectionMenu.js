import { Component } from 'react';
import { normalCards, reversedCardKeys } from '../CardInfo';

import * as styles from "../styles/Components.module.css"

const options = [<option value="" key="none"></option>].concat( reversedCardKeys.map(
    cardKey => <option value={cardKey} key={cardKey}>{cardKey}</option>
) );

export class PhoenixSelectionMenu extends Component {
    state = {
        selection: this.props.phoenix.tempName
    }

    storeSelection = (event) => {
        if (event.target.value === "") {
            window.alert("No specific alternative value selected for Phoenix.")
        }
        else {
            this.props.phoenix.tempName = event.target.value;
            this.props.phoenix.tempValue = normalCards.get(event.target.value).value;
            this.setState({
                selection: event.target.value
            });
        }
    }

    render() {
        return (
            <div className={styles.phoenixSelectionContainer}>
                <form>
                <label>
                    <select value={this.state.selection} onChange={this.storeSelection}>
                    {options}
                    </select>
                </label>
                </form>
                <span>
                    {this.props.selection === "" ? "" : `Selected: ${this.state.selection}`}
                </span>
            </div>            
          );
    }
}
