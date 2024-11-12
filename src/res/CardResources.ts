import mahjong from './mahjong.png'
import phoenix from './phoenix.png'
import dogs from './dogs.png'
import dragon from './dragon.png'
// Red cards
import red_2 from './red_2.png'
import red_3 from './red_3.png'
import red_4 from './red_4.png'
import red_5 from './red_5.png'
import red_6 from './red_6.png'
import red_7 from './red_7.png'
import red_8 from './red_8.png'
import red_9 from './red_9.png'
import red_10 from './red_10.png'
import red_J from './red_J.png'
import red_Q from './red_Q.png'
import red_K from './red_K.png'
import red_A from './red_A.png'
// Blue cards
import blue_2 from './blue_2.png'
import blue_3 from './blue_3.png'
import blue_4 from './blue_4.png'
import blue_5 from './blue_5.png'
import blue_6 from './blue_6.png'
import blue_7 from './blue_7.png'
import blue_8 from './blue_8.png'
import blue_9 from './blue_9.png'
import blue_10 from './blue_10.png'
import blue_J from './blue_J.png'
import blue_Q from './blue_Q.png'
import blue_K from './blue_K.png'
import blue_A from './blue_A.png'
// Green cards
import green_2 from './green_2.png'
import green_3 from './green_3.png'
import green_4 from './green_4.png'
import green_5 from './green_5.png'
import green_6 from './green_6.png'
import green_7 from './green_7.png'
import green_8 from './green_8.png'
import green_9 from './green_9.png'
import green_10 from './green_10.png'
import green_J from './green_J.png'
import green_Q from './green_Q.png'
import green_K from './green_K.png'
import green_A from './green_A.png'
// Black cards
import black_2 from './black_2.png'
import black_3 from './black_3.png'
import black_4 from './black_4.png'
import black_5 from './black_5.png'
import black_6 from './black_6.png'
import black_7 from './black_7.png'
import black_8 from './black_8.png'
import black_9 from './black_9.png'
import black_10 from './black_10.png'
import black_J from './black_J.png'
import black_Q from './black_Q.png'
import black_K from './black_K.png'
import black_A from './black_A.png'

import cardBackground from './background.png'

const _cardImages_ = {
    mahjong,
    phoenix,
    dogs,
    dragon,

    red_2,
    red_3,
    red_4,
    red_5,
    red_6,
    red_7,
    red_8,
    red_9,
    red_10,
    red_J,
    red_Q,
    red_K,
    red_A,

    blue_2,
    blue_3,
    blue_4,
    blue_5,
    blue_6,
    blue_7,
    blue_8,
    blue_9,
    blue_10,
    blue_J,
    blue_Q,
    blue_K,
    blue_A,
    
    green_2,
    green_3,
    green_4,
    green_5,
    green_6,
    green_7,
    green_8,
    green_9,
    green_10,    
    green_J,
    green_Q,
    green_K,
    green_A,
    
    black_2,
    black_3,
    black_4,
    black_5,
    black_6,
    black_7,
    black_8,
    black_9,
    black_10,
    black_J,
    black_Q,
    black_K,
    black_A,
    
    cardBackground
}

export const cardImages: ReadonlyMap<string, string> =
    new Map(Object.entries(_cardImages_));
