import React, {Component} from 'react';
import { Card } from './Card';
//import { CardInfo, cardNames } from '../CardInfo';

export class TableCards extends Component {
    void() {}

    render() {
        const tableBox = {
            display: 'grid',
            gridTemplateRows: '11% 89%',
            border: '1px solid white',
            width: '100%',
            height: '90%'
        }
        const tableCardList = {            
            display: 'flex',
            border: '1px solid white',
            width: '100%',
            height: '100%'
        }
        const cardStyle = {
            width: '100%',
            height: '28%'
        }
        return (
            <div style={tableBox}>
                Table
                <div style={tableCardList}>
                    {this.props.currentCards.map( card => 
                    <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                    selected={true} clickCallback={this.void} style={cardStyle}/> )}
                    {/*
                    <hr/>
                    Rest
                    {this.props.previousCards.map( card => 
                    <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                    selected={card.isSelected} clickCallback={this.cardClicked}/> )}*/}
                </div>                
            </div>
        );
    }
}
