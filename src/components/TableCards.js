import React, {Component} from 'react';
import { Card } from './Card';
//import { CardInfo, cardNames } from '../CardInfo';

export class TableCards extends Component {
    render() {
        return (
            <div>
                {this.props.currentCards.map( card => 
                <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked}/> )}
            </div>
        );
    }
}
