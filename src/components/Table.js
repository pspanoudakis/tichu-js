import React, {Component} from 'react';
import {specialCards} from '../CardInfo';
import {cardImages} from '../CardResources';
import {Card} from './Card';

export class Table extends Component {
    void() {}

    dragonGiven = (event) => {
        this.props.dragonGiven(event.target.id)
    }

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
        const dragonSelection = {
            display: 'flex',
            width: '100%',
            height: '90%',
            position: 'relative'
        }
        const dragonStyle = {
            position: 'absolute',
            top: '23%',
            left: '0%',
            width: '12%',
            height: '48%'
        }
        const selection1 = {
            position: 'absolute',
            top: '0%',
            left: '14%',
            width: '15%',
            height: '100%'
        }
        const selection2 = {
            position: 'absolute',
            top: '0%',
            left: '30%',
            width: '15%',
            height: '100%'
        }
        let buttonText1 = '', buttonText2 = '';
        if (this.props.pendingDragon) {
            if (this.props.currentPlayerIndex % 2 === 0) {
                if (this.props.activePlayers[1]) {
                    buttonText1 = this.props.playerNames[1];
                }
                if (this.props.activePlayers[3]) {
                    buttonText2 = this.props.playerNames[3];
                }                
            }
            else {
                if (this.props.activePlayers[0]) {
                    buttonText1 = this.props.playerNames[0];
                }
                if (this.props.activePlayers[2]) {
                    buttonText2 = this.props.playerNames[2];
                }
            }
        }
        return (
            <div style={tableBox}>
                <span style={{paddingLeft: '2%'}}>
                    {this.props.requestedCard === ''
                    ? ''
                    : ('Requested: ' + this.props.requestedCard)}
                </span>
                {!this.props.pendingDragon ?
                <div style={tableCardList}>
                    {this.props.currentCards.map( (card, index) => {
                        const cardStyle = {
                            zindex: index.toString(),
                            position: 'absolute',
                            bottom: '29%',
                            left: (index * 6.5).toString() + '%',
                            width: '12%',
                            height: '48%'
                        }
                        return (
                        <Card key={card.key} id={card.key} cardImg={card.cardImg}
                        alt={card.alt} selected={true} clickCallback={this.void}
                        style={cardStyle}/>
                        );
                    })}
                </div> :
                <div style={dragonSelection}>
                    <Card key={specialCards.DRAGON} id={specialCards.DRAGON}
                    cardImg={cardImages.dragon} alt={specialCards.DRAGON}
                    selected={true} clickCallback={this.void} style={dragonStyle}/>
                    {buttonText1 !== ''
                    ? <button key={buttonText1} id={buttonText1} onClick={this.dragonGiven}
                    style={selection1}>
                        {buttonText1}
                    </button>
                    : ''}
                    
                    {buttonText2 !== ''
                    ? <button key={buttonText2} id={buttonText2} onClick={this.dragonGiven}
                    style={selection2}>
                        {buttonText2}
                    </button>
                    : ''}
                </div>}            
            </div>
        );
    }
}
