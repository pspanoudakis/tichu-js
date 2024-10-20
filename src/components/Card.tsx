import React, { useCallback } from 'react';
import { cardImages } from '../CardResources';

export const Card: React.FC<{
    id: string,
    isSelected?: boolean,
    anySelected?: boolean,
    cardImg: string,
    alt: string,
    onClick?: (id: string) => void,
    index: number,
}> = (props) => {

    const onClick = useCallback(() => {
        props.onClick?.(props.id);
    }, [props.id, props.onClick]);

    const movePct = !props.anySelected ? undefined : '15%'

    return (
        <img
            src={cardImages.get(props.cardImg)}
            alt={props.alt}
            onClick={onClick}
            style={{
                userSelect: "none",
                filter:
                    'drop-shadow(0.5vw 0.25vh 0.5vw rgba(0, 0, 0, 0.65))' +
                    (!props.isSelected && props.anySelected ? ' brightness(62.5%) contrast(85%)' : ''),
                ...(
                    props.isSelected ?
                    { transform: `translateY(-${movePct})`} : {}
                ),
                ...{
                    position: 'absolute',
                    left: (props.index * 6.5).toString() + '%',
                    bottom: '15%',
                    transition: '85ms, left 100ms',
                    height: '65%',
                },
            }}
        />
    );
}
