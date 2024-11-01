import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { RequestSelectionBox } from './RequestSelectionBox';
import { PhoenixSelectionMenu } from './PhoenixSelectionMenu';

import { inGamePlayerBoxClass, leftActionButtonsDiv, rightActionButtonsDiv, tichuBetDivClass } from "./styleUtils";
import { AppContext } from '../AppContext';

import styles from "../styles/Components.module.css"
import { BetIndicator } from './BetIndicator';
import { UICardInfo } from '../game_logic/UICardInfo';
import { SpecialCards } from '../game_logic/shared/CardConfig';
import { PlayerBet, PlayerKey } from '../game_logic/shared/shared';
import { PlayerInfoHeader } from './PlayerInfoHeader';
import { ClientEventType, DropBombEvent, PassTurnEvent, PlayCardsEvent } from '../game_logic/shared/ClientEvents';
import { PlaceBetButton } from './PlaceBetButton';
import { CardInfo } from '../game_logic/shared/CardInfo';

export const ControlledPlayerHand: React.FC<{}> = (props) => {

    const { state: ctxState } = useContext(AppContext);

    const playerNickname = ctxState.gameContext.thisPlayer?.nickname;
    const cardKeys =
        ctxState.gameContext.currentRoundState?.thisPlayer.cardKeys ?? [];

    const cards = useMemo(
        () => cardKeys.map(k => new UICardInfo(k)).sort(CardInfo.compareCards),
        [cardKeys]
    );

    const [cardSelections, setCardSelections] = useState<{[s: string]: boolean}>(
        cards.reduce((acc, c) => ({...acc, [c.key]: false}), {})
    );

    const [phoenixAltValue, setPhoenixAltValue] = useState(0.5);

    useEffect(() => {
        setCardSelections(
            cards.reduce((acc, c) => ({...acc, [c.key]: false}), {})
        );
    }, [cards]);    

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

    const onCardsPlayed = useCallback(() => {
        const e: PlayCardsEvent = {
            eventType: ClientEventType.PLAY_CARDS,
            data: {
                selectedCardKeys:
                    Object.keys(cardSelections).filter(k => cardSelections[k]),
            }
        };
        ctxState.socket?.emit(ClientEventType.PLAY_CARDS, e);
    }, [ctxState.socket, cardSelections]);

    const onTurnPassed = useCallback(() => {
        const e: PassTurnEvent = {
            eventType: ClientEventType.PASS_TURN,
        };
        ctxState.socket?.emit(ClientEventType.PASS_TURN, e);
    }, [ctxState.socket]);

    const onBombDropped = useCallback(() => {
        const e: DropBombEvent = {
            eventType: ClientEventType.DROP_BOMB,
        };
        ctxState.socket?.emit(ClientEventType.DROP_BOMB, e);
    }, [ctxState.socket]);

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
                <PlayerInfoHeader
                    nickname={playerNickname ?? 'You'}
                    bet={ctxState.gameContext.currentRoundState?.thisPlayer.playerBet}
                    numCards={cards.length}
                />
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
                    <button onClick={onCardsPlayed}>Play Cards</button>
                    <button onClick={onTurnPassed}>Pass</button>
                    <button onClick={onBombDropped}>Bomb</button>
                    <PlaceBetButton bet={PlayerBet.TICHU}/>
                </div>
            </div>
        </div>
    )
}
