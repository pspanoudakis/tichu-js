import React, {Component} from 'react';
import {normalCardKeys} from '../CardInfo';

import * as styles from "../styles/Components.module.css"

const reversedCardKeys = Array.from(normalCardKeys).reverse();

export class RequestSelectionBox extends Component {

    selectionMade = (event) => {
        this.props.requestMade(event.target.id);
    }

    render() {
        return (
        <div className={styles.selectionBoxStyle}>
            {reversedCardKeys.map(name => 
                <button key={name} id={name} onClick={this.selectionMade}
                className={styles.selectionButtonStyle}>
                {name}
                </button>
            )}
        </div>
        );
    }
}
