import { IBasketData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { Component } from "../base/Component";

export class BasketV extends Component<IBasketData> {
    protected basketList: HTMLElement
    protected basketTitle: HTMLElement
    protected totalPrice: HTMLElement
    protected orderButton: HTMLButtonElement

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container)

        this.orderButton = ensureElement<HTMLButtonElement>(
            '.basket__button',
            this.container
        );
        this.basketTitle = ensureElement<HTMLElement>(
            '.modal__title',
            this.container
        );
        this.totalPrice = ensureElement<HTMLElement>(
            '.basket__price',
            this.container
        );
        this.basketList = ensureElement<HTMLElement>(
            '.basket__list',
            this.container
        );
        this.items = []
        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order')
        });
    }

    set items(value: HTMLElement[]) {
        if (!value || value.length === 0) {
            this.basketList.replaceChildren(...value);
            this.orderButton.disabled = true;
        } else {
            this.basketList.replaceChildren(...value)
            this.orderButton.disabled = false
        }
    }

    set total(value: number) {
        this.totalPrice.textContent = `${value} синапсов`
    }
}