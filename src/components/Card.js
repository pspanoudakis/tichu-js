import { Component } from 'react';

export class Card extends Component {
    clickDetected = (e) => {
        this.props.clickCallback(this.props.id);
    }

    render() {
        let imgStyle = {
            filter: 'drop-shadow(0.5vw 0.25vh 0.5vw rgba(0, 0, 0, 0.65))'
        };
        if (this.props.movePosition !== undefined) {
            if (!this.props.selected) {
                imgStyle.filter = imgStyle.filter + ' brightness(62.5%) contrast(85%)';
            }
            else {
                imgStyle.transform = `translateY(-${this.props.movePosition})`
            }
        }

        Object.assign(imgStyle, this.props.style);
        return (
            <img src={this.props.cardImg} alt={this.props.alt}
            onClick={this.clickDetected} style={imgStyle}/>
        )
    }
}
