import { ensureElement } from "../../../utils/utils"
import { IEvents } from "../../base/Events"
import { Form } from "./form";

interface IContactsForm{
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm>{
    protected emailInputElement:HTMLInputElement;
    protected phoneInputElement:HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLElement){
        super(events, container);

        this.emailInputElement = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

        this.emailInputElement.addEventListener('input', () => {
            this.events.emit('email:change', { email: this.emailInputElement.value })
        })

        this.phoneInputElement.addEventListener('input', () => {
            this.events.emit('phone:change', { phone: this.phoneInputElement.value })
        })

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string){
        this.emailInputElement.value = value;
    }

    set phone(value: string){
        this.phoneInputElement.value = value;
    }
}