import React, {Component} from 'react';
import { Card } from './Card';

export class Table extends Component {
    void() {}

    render() {
        const tableBox = {
            border: '1px solid white',
            width: '100%',
            height: '90%'
        }
        const tableCardList = {            
            display: 'flex',
            width: '100%',
            height: '90%',
            position: 'relative'
        }
        return (
            <div style={tableBox}>
                <span style={{paddingLeft: '2%'}}>Table</span>
                <div style={tableCardList}>
                    {this.props.currentCards.map( (card, index) => {
                        const cardStyle = {
                            zindex: index.toString(),
                            position: 'absolute',
                            bottom: '30%',
                            left: (index * 6.5).toString() + '%',
                            width: '12%',
                            height: '49%'
                        }
                        return <Card key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                        selected={true} clickCallback={this.void} style={cardStyle}/>;
                    })}
                </div>                
            </div>
        );
    }
}
