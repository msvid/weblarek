import { ensureElement } from "../../../utils/utils";
import { TCardAction } from "../../../types";
import { Card } from "./card";
import { CDN_URL, categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap

interface ICardCatalog{
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalog>{
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: TCardAction){
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick)
        }
    }
    set category(value:string) {
        this.categoryElement.textContent = value

        for (const key in categoryMap){
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            )
        }   
    }

    set image(value:string){
        const fullUrl = value.startsWith('http') ? value : CDN_URL + value;
        this.setImage(this.imageElement, fullUrl, '');
    }   
}