import React, {Component} from 'react';
import { Card } from './Card';
//import { CardInfo, cardNames } from '../CardInfo';

export class TableCards extends Component {
    void() {}

    render() {
        let style = {
            display: 'flex',
            border: '1px solid white',
            width: '100%',
            height: '100%',
        }
        return (
            <div style={style}>
                Table
                {this.props.currentCards.map( card => 
                <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={true} clickCallback={this.void}/> )}
                {/*
                <hr/>
                Rest
                {this.props.previousCards.map( card => 
                <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked}/> )}*/}
            </div>
        );
    }
}
