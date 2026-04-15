import { Component } from "../../base/Component"
import { ensureElement } from "../../../utils/utils"
import { IEvents } from "../../base/Events"

interface IForm {
    valid: boolean;
}

export abstract class Form<T> extends Component<T & IForm>{
    protected submitButton:HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement){
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.submitButton.disabled = true;
    }

    set valid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }

    errors(message: string): void{
        this.errorsElement.textContent = message;
    }
}