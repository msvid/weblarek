import { ensureElement } from "../../../utils/utils"
import { IEvents } from "../../base/Events"
import { Form } from "./form";

export class ContactsForm extends Form {
    protected formEmailInput: HTMLInputElement
    protected formPhoneInput: HTMLInputElement

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events)
        this.formEmailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container)
        this.formPhoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container)

        this.formEmailInput.addEventListener('input', () => {
            this.events.emit('contacts:email', { email: this.formEmailInput.value })
        })

        this.formPhoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone', { phone: this.formPhoneInput.value })
        })

        this.formSubmitButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.events.emit('contacts:submit')
        })
    }

    email(value: string): void {
        this.formEmailInput.value = value
    }

    phone(value: string): void {
        this.formPhoneInput.value = value
    }

    protected onSubmit(): void {
        this.events.emit('contacts:submit')
    }
}