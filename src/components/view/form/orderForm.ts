import { ensureElement } from "../../../utils/utils"
import { IEvents } from "../../base/Events"
import { Form } from "./form";

export class OrderForm extends Form {
    protected formAddressInput: HTMLInputElement
    protected formCardPayButton: HTMLButtonElement
    protected formCashPayButton: HTMLButtonElement

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events)

        this.formCardPayButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container)
        this.formCashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container)
        this.formAddressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container)

        this.formCardPayButton.addEventListener('click', () => {
            this.events.emit('payment:change', { payment: 'card' })
        })
        this.formCashPayButton.addEventListener('click', () => {
            this.events.emit('payment:change', { payment: 'cash' })
        })
        this.formAddressInput.addEventListener('input', () => {
            this.events.emit('address:change', { address: this.formAddressInput.value })
        })
    }

    address(value: string): void {
        this.formAddressInput.value = value
    }

    selectPaymentButtonStatus(status: 'card' | 'cash' | null): void {
        this.formCardPayButton.classList.toggle('button_alt-active', status === 'card')
        this.formCashPayButton.classList.toggle('button_alt-active', status === 'cash')
    }

    protected onSubmit(): void {
        this.events.emit('order:submit')
    }
}