import React, {Component} from 'react';
import { Card } from './Card';

export class Table extends Component {
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
            width: '100%',
            height: '100%',
            position: 'relative'
        }
        return (
            <div style={tableBox}>
                Table
                <div style={tableCardList}>
                    {this.props.currentCards.map( (card, index) => {
                        const cardStyle = {
                            zindex: index.toString(),
                            position: 'absolute',
                            top: '0%',
                            left: (index * 6.5).toString() + '%',
                            width: '11%',
                            height: '42%'
                        }
                        return <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                        selected={true} clickCallback={this.void} style={cardStyle}/>;
                    })}
                </div>                
            </div>
        );
    }
}
