import { z } from "zod";

const CardColor = {
    BLACK: 'black',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
} as const;

export type CardColor = typeof CardColor[keyof typeof CardColor];

export const cardColorValues = Object.values(CardColor);

const zNumericCardName = z.union([
    z.literal('2'),
    z.literal('3'),
    z.literal('4'),
    z.literal('5'),
    z.literal('6'),
    z.literal('7'),
    z.literal('8'),
    z.literal('9'),
    z.literal('10'),
]);
type NumericCardName = z.infer<typeof zNumericCardName>;

const zLetterCardName = z.union([
    z.literal('J'),
    z.literal('Q'),
    z.literal('K'),
    z.literal('A'),
]);
type LetterCardName = z.infer<typeof zLetterCardName>;
export const LetterCardValues: {
    [l in LetterCardName]: number
} = {
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
} as const;

const zSpecialCardName = z.union([
    z.literal('Dogs'),
    z.literal('Phoenix'),
    z.literal('Mahjong'),
    z.literal('Dragon'),
])
type SpecialCardName = z.infer<typeof zSpecialCardName>;
export const SpecialCards: {
    [name in SpecialCardName]: name
} = {
    Dogs: 'Dogs',
    Dragon: 'Dragon',
    Mahjong: 'Mahjong',
    Phoenix: 'Phoenix',
} as const;
export const specialCardNames = Object.values(SpecialCards) as string[];

export const zNormalCardName = z.union([zNumericCardName, zLetterCardName]);
export type NormalCardName = NumericCardName | LetterCardName;

export const zCardKey = z.string();
export const zCardName = z.union([zNormalCardName, zSpecialCardName]);
export type CardName = z.infer<typeof zCardName>;

export const NormalCardConfig: {
    [name in NormalCardName]: {
        [color in typeof CardColor[keyof typeof CardColor]]: {
            key: string,
            img: string,
        }
    }
} = {
    "2": {
        red: {
            key: "red_2",
            img: "red_2"
        },
        black: {
            key: "black_2",
            img: "black_2"
        },
        blue: {
            key: "blue_2",
            img: "blue_2"
        },
        green: {
            key: "green_2",
            img: "green_2"
        },
    },
    "3": {
        red: {
            key: "red_3",
            img: "red_3"
        },
        black: {
            key: "black_3",
            img: "black_3"
        },
        blue: {
            key: "blue_3",
            img: "blue_3"
        },
        green: {
            key: "green_3",
            img: "green_3"
        },
    },
    "4": {
        red: {
            key: "red_4",
            img: "red_4"
        },
        black: {
            key: "black_4",
            img: "black_4"
        },
        blue: {
            key: "blue_4",
            img: "blue_4"
        },
        green: {
            key: "green_4",
            img: "green_4"
        },
    },
    "5": {
        red: {
            key: "red_5",
            img: "red_5"
        },
        black: {
            key: "black_5",
            img: "black_5"
        },
        blue: {
            key: "blue_5",
            img: "blue_5"
        },
        green: {
            key: "green_5",
            img: "green_5"
        },
    },
    "6": {
        red: {
            key: "red_6",
            img: "red_6"
        },
        black: {
            key: "black_6",
            img: "black_6"
        },
        blue: {
            key: "blue_6",
            img: "blue_6"
        },
        green: {
            key: "green_6",
            img: "green_6"
        },
    },
    "7": {
        red: {
            key: "red_7",
            img: "red_7"
        },
        black: {
            key: "black_7",
            img: "black_7"
        },
        blue: {
            key: "blue_7",
            img: "blue_7"
        },
        green: {
            key: "green_7",
            img: "green_7"
        },
    },
    "8": {
        red: {
            key: "red_8",
            img: "red_8"
        },
        black: {
            key: "black_8",
            img: "black_8"
        },
        blue: {
            key: "blue_8",
            img: "blue_8"
        },
        green: {
            key: "green_8",
            img: "green_8"
        },
    },
    "9": {
        red: {
            key: "red_9",
            img: "red_9"
        },
        black: {
            key: "black_9",
            img: "black_9"
        },
        blue: {
            key: "blue_9",
            img: "blue_9"
        },
        green: {
            key: "green_9",
            img: "green_9"
        },
    },
    "10": {
        red: {
            key: "red_10",
            img: "red_10"
        },
        black: {
            key: "black_10",
            img: "black_10"
        },
        blue: {
            key: "blue_10",
            img: "blue_10"
        },
        green: {
            key: "green_10",
            img: "green_10"
        },
    },
    "J": {
        red: {
            key: "red_J",
            img: "red_J"
        },
        black: {
            key: "black_J",
            img: "black_J"
        },
        blue: {
            key: "blue_J",
            img: "blue_J"
        },
        green: {
            key: "green_J",
            img: "green_J"
        },
    },
    "Q": {
        red: {
            key: "red_Q",
            img: "red_Q"
        },
        black: {
            key: "black_Q",
            img: "black_Q"
        },
        blue: {
            key: "blue_Q",
            img: "blue_Q"
        },
        green: {
            key: "green_Q",
            img: "green_Q"
        },
    },
    "K": {
        red: {
            key: "red_K",
            img: "red_K"
        },
        black: {
            key: "black_K",
            img: "black_K"
        },
        blue: {
            key: "blue_K",
            img: "blue_K"
        },
        green: {
            key: "green_K",
            img: "green_K"
        },
    },
    "A": {
        red: {
            key: "red_A",
            img: "red_A"
        },
        black: {
            key: "black_A",
            img: "black_A"
        },
        blue: {
            key: "blue_A",
            img: "blue_A"
        },
        green: {
            key: "green_A",
            img: "green_A"
        },
    },
} as const;
export const normalCardKeys = Object.keys(NormalCardConfig);
export const reversedCardKeys = Array.from(normalCardKeys).reverse();

const SpecialCardConfig: {
    [name in SpecialCardName]: {
        img: string
    }
} = {
    Dogs: {
        img: 'dogs'
    },
    Dragon: {
        img: 'dragon'
    },
    Phoenix: {
        img: 'phoenix'
    },
    Mahjong: {
        img: 'mahjong'
    },
} as const;

type CardConfigMapEntry = {
    name: string,
    img: string,
    color?: CardColor,
}
const CardKeyToConfigMap:
    ReadonlyMap<string, CardConfigMapEntry> = new Map(Object.entries({
        ...Object.entries(NormalCardConfig).reduce<
            { [key: string]: CardConfigMapEntry }
        >((acc, [n, v]) => {
            Object.values(CardColor).forEach(c => acc[v[c].key] = {
                name: n,
                img: v[c].img,
                color: c,
            })
            return acc;
        }, {}),
        ...Object.entries(SpecialCardConfig).reduce<
            { [key: string]: CardConfigMapEntry }
        >((acc, [n, v]) => {
            acc[n] = {
                name: n,
                img: v.img,
            }
            return acc;
        }, {})
    }));

export function getCardConfigByKey(key: string) {
    return CardKeyToConfigMap.get(key);
}

export function getNormalCardValueByName(name: string) {
    const isNumericName = zNumericCardName.safeParse(name);
    if (isNumericName.success)
        return Number(isNumericName.data);
    const isLetterName = zLetterCardName.safeParse(name);
    if (isLetterName.success)
        return LetterCardValues[isLetterName.data];
    throw new Error(`'${name}' is not a valid normal card name.`);
}
