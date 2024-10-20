import { CardInfo } from "./shared/CardInfo";
import { getCardConfigByKey } from "./shared/CardConfig";

export class UICardInfo extends CardInfo {
    /** The card image path */
    private _img: string;
    /** Alternative text to display if the image is not found */
    private _imgAlt: string;

    constructor(key: string) {
        const config = getCardConfigByKey(key);
        if (!config)
            throw new Error(`Unexpected card key: ${key}`);
        super(config.name, config.color);
        this._img = config.img;
        this._imgAlt = this.key;
    }

    get img() {
        return this._img;
    }

    get imgAlt() {
        return this._imgAlt;
    }

}