import { Component } from 'react';
import { cardImages } from '../CardResources';

export class Card extends Component {
    clickDetected = (e) => {
        this.props.clickCallback(this.props.id);
    }

    render() {
        let imgStyle = {};
        if (!this.props.selected) {
            imgStyle.filter = 'brightness(55%) contrast(80%)';
        }

        Object.assign(imgStyle, this.props.style);
        return (
            <img src={this.props.cardImg} alt={this.props.alt}
            onClick={this.clickDetected} style={imgStyle}/>
        )
    }
}
