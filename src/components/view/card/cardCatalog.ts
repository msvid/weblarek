import { Card } from "./card";
import { ICardAction, TCardCatalog } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";



export class CardCatalog extends Card<TCardCatalog> {
    protected categoryI: HTMLElement;
    protected img: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardAction) {
        super(container);

        this.categoryI = ensureElement<HTMLElement>('.card__category', this.container);
        this.img = ensureElement<HTMLImageElement>('.card__image', this.container)

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick)
        }
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryI.classList.add(categoryMap[value]);
        this.categoryI.textContent = value;
    }

    set image(value: { src: string; alt: string }) { // ← должно быть объектом!
        this.setImage(this.img, CDN_URL + value.src, value.alt);
    }
}