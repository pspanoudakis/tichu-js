import React, {Component} from 'react';
import { Card } from './Card';
import majong from '../res/majong.png'
import phenoix from '../res/phenoix.png'
import dogs from '../res/dogs.png'
import dragon from '../res/dragon.png'

export class PlayerHand extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            selected: []
        }
    }

    add = () => {
        let cardObjects = [];
        cardObjects.push({
            cardImg: majong,
            alt: "Majong",
            isSelected: false,
            key: '0'
        })
        cardObjects.push({
            cardImg: phenoix,
            alt: "Phenoix",
            isSelected: false,
            key: '1'
        })
        this.setState({
            cards: cardObjects,
            selected: []
        })
    }

    cardClicked = (key) => {
        console.log(key);
        let newNonSelected = [];
        let newSelected = [];
        let found = false;
        for (let index = 0; index < this.state.cards.length; index++) {
            if (this.state.cards[index].key === key)
            {
                this.state.cards[index].isSelected = true;
                newSelected.push(this.state.cards[index])
                this.state.selected.forEach(card => newSelected.push(card));
                found = true;
            }
            else
            {
                newNonSelected.push(this.state.cards[index]);
            }
        }
        if (!found) {
            for (let index = 0; index < this.state.selected.length; index++) {
                if (this.state.selected[index].key === key)
                {
                    this.state.selected[index].isSelected = false;
                    newNonSelected.push(this.state.selected[index])
                }
                else
                {
                    newSelected.push(this.state.selected[index]);
                }
            }
        }
        this.setState({
            cards: newNonSelected,
            selected: newSelected
        })
    }

    renderedCards = () => {
        return (
            <div>
                Non selected
                {this.state.cards.map(card => <Card 
                key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked}/>)}
                <br/>
                Selected
                {this.state.selected.map(card => <Card 
                key={card.key} id={card.key} cardImg={card.cardImg} alt={card.alt}
                selected={card.isSelected} clickCallback={this.cardClicked}/>)}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderedCards()}
                <button onClick={this.add}></button>
            </div>
        )
    }
}
