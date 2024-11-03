import React, { useCallback, useEffect, useState } from 'react';

import styles from "../styles/Components.module.css"
import {
    NormalCardName,
    reversedNormalCardNames,
    zNormalCardName
} from '../game_logic/shared/CardConfig';

const options = [
    <option value="" key="none"></option>,
    ...reversedNormalCardNames.map(
        cn => <option value={cn} key={cn}>{cn}</option>
    )  
];

export const PhoenixSelector: React.FC<{
    onAltNameChange: (newVal?: NormalCardName) => void,
}> = ({ onAltNameChange }) => {

    const [phoenixAltName, setPhoenixAltName] = useState<NormalCardName>();

    useEffect(() => {
        // "componentWillUnmount"
        return () => onAltNameChange();
      }, [onAltNameChange])

    const onSelection = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!event.target.value) {
            onAltNameChange();
        }
        else {
            const selectedName = zNormalCardName.parse(event.target.value);
            onAltNameChange(selectedName);
            setPhoenixAltName(selectedName);
        }
    }, [onAltNameChange]);
    
    return (
        <div className={styles.phoenixSelectionContainer}>
            <form>
                <label>
                    <select
                        className={styles.phoenixSelectMenu}
                        onChange={onSelection}
                    >
                        {options}
                    </select>
                </label>
            </form>
            <span style={{paddingLeft: '1%'}}>{
                phoenixAltName && `Selected: ${phoenixAltName}`
            }</span>
        </div>            
    );
}
