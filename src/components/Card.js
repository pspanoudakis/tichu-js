import React, {Component} from 'react';
import { cardBackground, cardImages } from '../CardExports';

export class Card extends Component {
    clickDetected = (e) => {
        this.props.clickCallback(this.props.id);
    }

    render() {
        let imgStyle = {
            width: '100%',
            height: '100%'
        };
        let divStyle = {
            opacity: '1'
        }
        if (!this.props.selected) {
            imgStyle.opacity = '0.66';
            divStyle.backgroundImage = `url(${cardImages.cardBackground})`;
            divStyle.backgroundSize = '100% 100%'
        }

        Object.assign(divStyle, this.props.style);
        return (
            <div style={divStyle}>
                <img src={this.props.cardImg} alt={this.props.alt}
                onClick={this.clickDetected} style={imgStyle}/>
            </div>            
        )
    }
}
