import React, {Component} from 'react';
import { normalCards, normalCardKeys } from '../CardInfo';

const reversedCardKeys = Array.from(normalCardKeys).reverse();

const options = [<option value="" key="none"></option>].concat( reversedCardKeys.map(
    cardKey => <option value={cardKey} key={cardKey}>{cardKey}</option>
) );

export class PhoenixSelectionMenu extends Component {
    state = {
        selection: ""
    }

    changeSelection = (event) => {
        this.setState({
            selection: event.target.value
        });
    }

    storeSelection = (event) => {
        event.preventDefault();
        if (this.state.selection === "") {
            window.alert("No specific alternative value selected for Phoenix.")
        }
        else {
            this.props.phoenix.tempName = this.state.selection;
            this.props.phoenix.tempValue = normalCards.get(this.state.selection).value;
        }
    }

    render() {
        return (
            <form onSubmit={this.storeSelection}>
              <label>
                <select value={this.state.selection} onChange={this.changeSelection}>
                  {options}
                </select>
              </label>
              <input type="submit" value="Select" />
            </form>
          );
    }
}
