import React, { useCallback } from 'react';

export const Card: React.FC<{
    id: string,
    selected?: boolean,
    cardImg: string,
    alt: string,
    movePosition?: string,
    onClick?: (id: string) => void,
    style: React.CSSProperties
}> = (props) => {

    const onClick = useCallback(() => {
        props.onClick?.(props.id);
    }, [props.id]);

    return (
        <img
            src={props.cardImg}
            alt={props.alt}
            onClick={onClick}
            style={{
                userSelect: "none",
                filter:
                    'drop-shadow(0.5vw 0.25vh 0.5vw rgba(0, 0, 0, 0.65))' +
                    (props.movePosition ? ' brightness(62.5%) contrast(85%)' : ''),
                ...(
                    props.movePosition ?
                    { transform: `translateY(-${props.movePosition})`} : {}
                ),
                ...props.style,
            }}
        />
    );
}
