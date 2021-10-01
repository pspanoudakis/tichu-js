import { Component } from 'react';
import { cardImages } from '../CardResources';

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
            imgStyle.opacity = '0.6';
            divStyle.backgroundImage = `url(${cardImages.get('cardBackground')})`;
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
