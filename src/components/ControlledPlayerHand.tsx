import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { RequestedCardSelector } from './RequestedCardSelector';
import { PhoenixSelector } from './PhoenixSelector';

import {
    inGamePlayerBoxClass,
    rightActionButtonsDiv,
} from "./styleUtils";
import { AppContext } from '../AppContext';

import styles from "../styles/Components.module.css"
import { UICardInfo } from '../game_logic/UICardInfo';
import {
    getNormalCardValueByName,
    NormalCardName,
    SpecialCards
} from '../game_logic/shared/CardConfig';
import { PlayerBet } from '../game_logic/shared/shared';
import { PlayerInfoHeader } from './PlayerInfoHeader';
import { PlaceBetButton } from './PlaceBetButton';
import { CardInfo } from '../game_logic/shared/CardInfo';
import { PlayCardsButton } from './PlayCardsButton';
import { PassTurnButton } from './PassTurnButton';
import { DropBombButton } from './DropBombButton';

export const ControlledPlayerHand: React.FC<{}> = (props) => {

    const { state: ctxState } = useContext(AppContext);

    const playerNickname = ctxState.gameContext.thisPlayer?.nickname;
    const cardKeys =
        ctxState.gameContext.currentRoundState?.thisPlayer.cardKeys ?? [];

    const [phoenixAltName, setPhoenixAltName] = useState<NormalCardName>();

    const cards = useMemo(
        () => {
            const phoenixValue =
                (phoenixAltName && getNormalCardValueByName(phoenixAltName)) ?? 0;
            return cardKeys.map(k => new UICardInfo(k)).sort(
                (a, b) => CardInfo.compareCardsAlt(a, b, phoenixValue)
            );
        },
        [cardKeys, phoenixAltName]
    );

    const [cardSelections, setCardSelections] = useState<{[s: string]: boolean}>(
        cards.reduce((acc, c) => ({...acc, [c.key]: false}), {})
    );

    const hasSelectedCards = useMemo(
        () => Object.values(cardSelections).some(s => s),
        [cardSelections]
    );

    useEffect(() => {
        setCardSelections(
            cs => cards.reduce((acc, c) => ({...acc, [c.key]: cs[c.key]}), {})
        );
    }, [cards]);    

    const onCardClicked = useCallback(
        (cardKey: string) => setCardSelections({
            ...cardSelections,
            [cardKey]: !cardSelections[cardKey]
        }),
        [cardSelections]
    );
    
    return (
        <div className={styles.thisPlayer}>
            <div className={inGamePlayerBoxClass}>
                <PlayerInfoHeader
                    nickname={playerNickname ?? 'You'}
                    bet={ctxState.gameContext.currentRoundState?.thisPlayer.playerBet}
                    numCards={cards.length}
                />
                <div className={styles.playerCardList}>{
                    cards.map((c, i) => 
                        <Card
                            key={c.key} id={c.key} index={i}
                            cardImg={c.img} alt={c.imgAlt}
                            isSelected={cardSelections[c.key]}
                            anySelected={hasSelectedCards}
                            onClick={onCardClicked}
                        />
                    )
                }</div>
                <div className={styles.selectionsContainer}>
                {
                    cardSelections[SpecialCards.Mahjong] &&
                    <RequestedCardSelector/>
                }
                {
                    cardSelections[SpecialCards.Phoenix] &&
                    (Object.values(cardSelections).filter(cs => cs).length > 4) &&
                    <PhoenixSelector onAltNameChange={setPhoenixAltName}/>
                }
                </div>
            </div>
            <div className={styles.actionButtonsMainContainer}>
                <PlaceBetButton bet={PlayerBet.TICHU}/>
                <div className={rightActionButtonsDiv}>
                    <PlayCardsButton
                        cardSelections={cardSelections}
                        phoenixAltName={phoenixAltName}
                    />
                    <PassTurnButton/>
                    <DropBombButton/>
                    <PlaceBetButton bet={PlayerBet.TICHU}/>
                </div>
            </div>
        </div>
    )
}
