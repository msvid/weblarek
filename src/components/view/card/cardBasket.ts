import { ensureElement } from "../../../utils/utils.ts";
import { TCardBasket } from "../../../types";
import { Card } from "./card";

type CardAction = {
    onClick: () => void;
}

export class CardBasket extends Card<TCardBasket> {
    private cardIndexElement: HTMLElement;
    private cardButtonRemoveElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: CardAction) {
        super(container);

        this.cardIndexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardButtonRemoveElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container)

        if (actions?.onClick) {
            this.cardButtonRemoveElement.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.cardIndexElement.textContent = value.toString();
    }
}