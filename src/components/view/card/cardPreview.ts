import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./card";
import { CDN_URL, categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap

interface ICardPreview {
    category: string;
    text: string;
    image: string;
}

export class CardPreview extends Card<ICardPreview>{
    protected categoryElement: HTMLElement;
    protected textElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected cardButton:HTMLButtonElement;

    constructor(protected events:IEvents, container:HTMLElement){
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('cardPreview:click');
        });
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

    set text(value: string){
        this.textElement.textContent = value;
    }
    set buttonText(value: string) { 
        this.cardButton.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.cardButton.disabled = value;
    }
}