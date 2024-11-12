import React, { useCallback } from "react";

import styles from "../styles/Components.module.css"

const winningScores = [0, 500, 1000];
const scoreOptions = winningScores.map( (score, index) =>
    <option value={score.toString()} key={index}>
        {score} 
    </option>
);

export const WinScoreSelector: React.FC<{
    onSelected: (i: number) => void,
}> = ({ onSelected }) => {

    const onChange: React.ChangeEventHandler<HTMLSelectElement> =
        useCallback((event) => onSelected(Number(event.target.value)), [onSelected]);

    return(
        <div className={styles.winScoreSelector}>
            Select winning score:
            <select onChange={onChange}>
                {scoreOptions}
            </select>
        </div>
    );
}
