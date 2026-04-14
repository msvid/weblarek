import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./card";

interface ICardBasket{
    index: number;
}

export class CardBasket extends Card<ICardBasket>{
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    private productId: string = '';

    constructor(protected events: IEvents, container: HTMLElement){
        super(container)

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container)
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container)

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('deleteCard:delete', {
                id: this.productId
            });
        });
    }

    set index(value: number){
        this.indexElement.textContent = String(value)
    }

    set id(value: string) {
        this.productId = value;
    }
}