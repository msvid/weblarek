import { Component } from "../base/Component"
import { IOrderRes } from "../../types";
import { IEvents } from "../base/Events"
import { ensureElement } from "../../utils/utils"

export class Success extends Component<IOrderRes> {
    protected orderTitleElement: HTMLElement
    protected orderDescription: HTMLElement
    protected orderButton: HTMLButtonElement

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this.orderDescription = ensureElement<HTMLElement>('.order-success__description', container)
        this.orderTitleElement = ensureElement<HTMLElement>('.order-success__title', container)
        this.orderButton = ensureElement<HTMLButtonElement>('.order-success__close', container)

        this.orderButton.addEventListener('click', () => {
            this.events.emit('success:close')
        })
    }

    set total(value: number) {
        this.orderDescription.textContent = `Списано ${value} синапсов`
    }
}