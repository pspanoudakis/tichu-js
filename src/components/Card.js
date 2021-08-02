import React, {Component} from 'react';

export class Card extends Component {

    getStyle = (isSelected) => {
        let style = {};
        if (isSelected) {
            style.opacity = '1';
        }
        else {
            style.opacity = '0.6'
        }
        Object.assign(style, this.props.style);
        return style;
    }

    clickDetected = (e) => {
        this.props.clickCallback(this.props.id);
    }

    render() {
        const isSelected = this.props.selected;
        return (
            <div>
                <img src={this.props.cardImg} alt={this.props.alt}
                onClick={this.clickDetected} style={this.getStyle(isSelected)}/>
            </div>            
        )
    }
}
