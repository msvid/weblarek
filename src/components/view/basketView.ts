import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketView {
    items: HTMLElement[];
    totalPrice: number
}

export class BasketView extends Component<IBasketView>{
    protected textElement: HTMLElement;
    protected itemsElement: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected events: IEvents, container:HTMLElement){
        super(container);

        this.textElement = ensureElement<HTMLElement>('.modal__title', this.container);
        this.itemsElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(elements: HTMLElement[]){
        if(!elements || elements.length === 0){
            this.itemsElement.replaceChildren(...elements)
            this.orderButton.disabled = true
        } else{
            this.itemsElement.replaceChildren(...elements)
            this.orderButton.disabled = false
        }
    }

    set totalPrice(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    }
}