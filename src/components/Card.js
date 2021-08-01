import React, {Component} from 'react';

export class Card extends Component {

    getStyle = (isSelected) => {
        if (isSelected) {
            return {
                opacity: '1'
            };
        }
        else {
            return {
                opacity: '0.6'
            };
        }
    }

    clickDetected = (e) => {
        this.props.clickCallback(this.props.id);
    }

    render() {
        const isSelected = this.props.selected;
        return (
            <div onClick={this.clickDetected} style={this.getStyle(isSelected)}>
                <img src={this.props.cardImg} alt={this.props.alt}></img>
            </div>            
        )
    }
}
