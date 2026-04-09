import { Component } from "../../base/Component"
import { ensureElement } from "../../../utils/utils"
import { IEvents } from "../../base/Events"

export abstract class Form extends Component<HTMLElement> {
    protected formSubmitButton: HTMLButtonElement
    protected formError: HTMLElement

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container)
        this.formSubmitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container)
        this.formError = ensureElement<HTMLElement>('.form__errors', this.container)
        this.container.addEventListener('submit', (e) => {
            e.preventDefault()
            this.onSubmit()
        })
    }

    errors(message: string): void {
        this.formError.textContent = message
    }

    submitEnabled(enabled: boolean): void {
        this.formSubmitButton.disabled = !enabled
    }

    protected abstract onSubmit(): void
}