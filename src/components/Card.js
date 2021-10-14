import { Component } from 'react';

export class Card extends Component {
    clickDetected = (e) => {
        this.props.clickCallback(this.props.id);
    }

    render() {
        let imgStyle = {};
        if (this.props.movePosition !== undefined) {
            if (!this.props.selected) {
                imgStyle.filter = 'brightness(55%) contrast(85%)';
            }
            else {
                imgStyle.transform = `translateY(-${this.props.movePosition})`
            }
        }
        /* if (!this.props.selected) {
            imgStyle.filter = 'brightness(55%) contrast(85%)';
            if (this.props.movePosition !== undefined) {
                imgStyle.transform = `translateY(${this.props.movePosition})`
            }
        } */

        Object.assign(imgStyle, this.props.style);
        return (
            <img src={this.props.cardImg} alt={this.props.alt}
            onClick={this.clickDetected} style={imgStyle}/>
        )
    }
}
