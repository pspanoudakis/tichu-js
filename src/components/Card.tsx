import React, { useCallback } from 'react';
import { cardImages } from '../res/CardResources';

type CardProps = {
    id: string,
    isSelected?: boolean,
    anySelected?: boolean,
    cardImg: string,
    alt: string,
    onClick?: (id: string) => void,
    index: number,
    omitPosition?: boolean,
};

export const Card: React.FC<CardProps> = ({
    id,
    isSelected,
    anySelected,
    cardImg,
    alt,
    onClick,
    index,
    omitPosition,
}) => {

    const onCardClicked = useCallback(() => onClick?.(id), [id, onClick]);

    const movePct = !anySelected ? undefined : '15%'

    return (
        <img
            src={cardImages.get(cardImg)}
            alt={alt}
            onClick={onCardClicked}
            style={{
                userSelect: "none",
                filter:
                    'drop-shadow(0.5vw 0.25vh 0.5vw rgba(0, 0, 0, 0.65))' +
                    (!isSelected && anySelected ? ' brightness(62.5%) contrast(85%)' : ''),
                ...(
                    isSelected ?
                    { transform: `translateY(-${movePct})`} : {}
                ),
                ...(
                    !omitPosition ?
                    {
                        position: 'absolute',
                        left: (index * 6.5).toString() + '%',
                        bottom: '15%',
                    } : {}
                ),
                ...{
                    transition: '85ms, left 100ms',
                    height: '65%',
                },
            }}
        />
    );
}
