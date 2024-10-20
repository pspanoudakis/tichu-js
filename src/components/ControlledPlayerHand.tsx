import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { RequestSelectionBox } from './RequestSelectionBox';
import { PhoenixSelectionMenu } from './PhoenixSelectionMenu';
import { voidButton } from '../void';

import { inGamePlayerBoxClass, leftActionButtonsDiv, rightActionButtonsDiv, tichuBetDivClass } from "./styleUtils";
import { AppContext } from '../AppContext';

import styles from "../styles/Components.module.css"
import { BetIndicator } from './BetIndicator';
import { UICardInfo } from '../game_logic/UICardInfo';
import { SpecialCards } from '../game_logic/shared/CardConfig';
import { PlayerKey } from '../game_logic/shared/shared';

export const ControlledPlayerHand: React.FC<{}> = (props) => {

    const ctx = useContext(AppContext);

    const playerNickname = ctx.state.gameContext.thisPlayer?.nickname;
    const cardKeys =
        ctx.state.gameContext.currentRoundState?.thisPlayer.cardKeys ?? [];

    const [cardSelections, setCardSelections] = useState<{[s: string]: boolean}>(
        cardKeys.reduce((acc, ck) => ({...acc, [ck]: false}), {})
    );

    const [phoenixAltValue, setPhoenixAltValue] = useState(0.5);

    useEffect(() => {
        setCardSelections(
            cardKeys.reduce((acc, ck) => ({...acc, [ck]: false}), {})
        );
    }, [JSON.stringify(cardKeys)])

    const cards = useMemo(
        () => cardKeys.map(k => new UICardInfo(k)),
        [cardKeys]
    )

    const hasSelectedCards = useMemo(
        () => Object.values(cardSelections).some(s => s),
        [cardSelections]
    );

    const onCardClicked = useCallback(
        (cardKey: string) => setCardSelections({
            ...cardSelections,
            [cardKey]: !cardSelections[cardKey]
        }),
        [cardSelections]
    );

    const renderedMainBox = () => {
        const cardComponents = cards.map((c, index) => {
            return (
                <Card key={c.key} id={c.key} cardImg={c.img} index={index}
                alt={c.imgAlt} isSelected={cardSelections[c.key]} anySelected={hasSelectedCards}
                onClick={onCardClicked}/>
            );
        });
        // const phoenix = this.props.cards.find(card => card.name === specialCards.PHOENIX);
        // const selectedCards = this.props.cards.filter(card => card.isSelected);
        // const betMessage = this.getBetMessageElement();
        return (
            <div className={inGamePlayerBoxClass}>
                <div className={styles.playerInfo}>
                    <span className={styles.playerIDSpan}>{playerNickname}</span>
                    <BetIndicator
                        bet={ctx.state.gameContext.currentRoundState?.thisPlayer.playerBet}
                    />
                </div>
                <div className={styles.playerCardList}>
                    {cardComponents}
                </div>
                {/* <div className={styles.selectionsContainer}>
                    {this.props.actions.displaySelectionBox && this.props.cards.some(card => 
                    card.name === SpecialCards.Mahjong && card.isSelected)
                    ? <RequestSelectionBox onSelection={this.madeRequestSelection}/>
                    : this.props.actions.pendingRequest}
                    { (selectedCards.length >= 5 && phoenix !== undefined && phoenix.isSelected) 
                    ? <PhoenixSelectionMenu phoenix={phoenix} valueSelected={setPhoenixAltValue}/>
                    : ''}
                </div> */}
            </div>            
        )
    }
    
    let playCardsButton = '';
    let passButton = '';
    let bombButton = '';
    let tichuButton = '';
    // if (this.props.showOptions) {
    //     if (this.props.actions.hasTurn) {
    //         if (hasSelectedCards) {
    //             playCardsButton = <button onClick={this.playCards}>Play Cards</button>;
    //         }
    //         else {
    //             playCardsButton =   <button className={styles.disabledButton} onClick={voidButton}>
    //                                 Play Cards
    //                                 </button>;
    //         }
    //         if (this.props.actions.canPass) {
    //             passButton = <button onClick={this.passTurn}>Pass</button>
    //         }
    //     }
    //     if (this.props.actions.canBomb) {
    //         bombButton = <button onClick={this.dropBomb}>Bomb</button>
    //     }
    //     if (this.props.actions.canBetTichu) {
    //         tichuButton = <button onClick={this.tichuBet}>Tichu</button>
    //     }
    // }
    return (
        <div className={styles.thisPlayer}>
            {renderedMainBox()}
            <div className={styles.actionButtonsMainContainer}>
                <div className={leftActionButtonsDiv}>
                    {tichuButton}
                </div>
                <div className={rightActionButtonsDiv}>
                    {playCardsButton}{passButton}{bombButton}
                </div>
            </div>
        </div>
    )
}
