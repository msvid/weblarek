import { ensureElement } from "../../utils/utils.ts";
import { Component } from "../base/Component.ts";
import { IEvents } from "../base/Events.ts";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected basketCounterElement: HTMLElement;
    protected basketButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketCounterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketButtonElement.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set count(value: number) {
        this.basketCounterElement.textContent = String(value);
    }
}