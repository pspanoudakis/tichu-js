import React, {Component} from 'react';
import { normalCardKeys } from '../CardInfo';

export class RequestSelectionBox extends Component {

    selectionMade = (event) => {
        this.props.requestMade(event.target.id);
    }

    render() {
        const selectionBoxStyle = {
            display: 'flex',
            width: '100%',
            height: 'min-content',
            overflow: 'visible'
        };
        const selectionButtonStyle = {
            overflow: 'visible'
        }
        return (
        <div style={selectionBoxStyle}>
            {normalCardKeys.reverse().map(name => 
                <button key={name} id={name} onClick={this.selectionMade}
                style={selectionButtonStyle}>
                {name}
                </button>
            )}
        </div>
        );
    }
}
