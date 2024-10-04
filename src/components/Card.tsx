import React, { Component } from 'react';

export class Card extends Component<{
    id: string,
    selected: boolean,
    cardImg: string,
    alt: string,
    movePosition?: string,
    clickCallback: (id: string) => void,
    style: React.CSSProperties
}> {
    clickDetected = () => {
        this.props.clickCallback(this.props.id);
    }

    render = () => (
        <img
            src={this.props.cardImg}
            alt={this.props.alt}
            onClick={this.clickDetected}
            style={{
                userSelect: "none",
                filter:
                    'drop-shadow(0.5vw 0.25vh 0.5vw rgba(0, 0, 0, 0.65))' +
                    (this.props.movePosition ? ' brightness(62.5%) contrast(85%)' : ''),
                ...(
                    this.props.movePosition ?
                    { transform: `translateY(-${this.props.movePosition})`} : {}
                ),
                ...this.props.style
            }}
        />
    );
}
