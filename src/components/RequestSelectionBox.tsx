import React, { Component } from 'react';
import { reversedCardKeys } from '../CardInfo';

import styles from "../styles/Components.module.css"

export class RequestSelectionBox extends Component<{
    onSelection: (id: string) => void
}> {

    selectionMade = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onSelection(event.currentTarget.id);
    }

    render = () => (
        <div className={styles.selectionBoxStyle}>
            {reversedCardKeys.map(name => 
                <button
                    key={name} id={name} onClick={this.selectionMade}
                    className={styles.selectionButtonStyle}
                >{name}</button>
            )}
        </div>
    );
}
