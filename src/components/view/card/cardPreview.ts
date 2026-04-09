import { ensureElement } from "../../../utils/utils";
import { Card } from "./card";
import { ICardImage, ICardPreview } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { EventEmitter } from "../../base/Events.ts";

export class CardPreview extends Card<ICardPreview> {
    protected categoryI: HTMLElement;
    protected img: HTMLImageElement;
    private descriptionI: HTMLElement;
    private cardButtonElement: HTMLButtonElement;
    
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.descriptionI = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.categoryI = ensureElement<HTMLElement>('.card__category', this.container);
        this.img = ensureElement<HTMLImageElement>('.card__image', this.container)

        this.cardButtonElement.addEventListener('click', () => {
            this.events.emit('cardPreview:click');
        });
    }

    set description(value: string) {
        this.descriptionI.textContent = value;
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryI.classList.add(categoryMap[value]);
        this.categoryI.textContent = value;
    }

    set image(value: ICardImage) {
        this.setImage(this.img, CDN_URL + value.src, value.alt);
    }

    set buttonText(value: string) {
        this.cardButtonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        if (value) {
            this.cardButtonElement.setAttribute('disabled', 'disabled');
        } else {
            this.cardButtonElement.removeAttribute('disabled');
        }
    }
}