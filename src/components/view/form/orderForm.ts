import { Form } from "./form";
import { TPayment } from "../../../types";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface IOrderForm{
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm>{
    protected cashPayButton: HTMLButtonElement;
    protected onlinePayButton: HTMLButtonElement;
    protected adressInputElement: HTMLInputElement;

    constructor(protected events: IEvents, container: HTMLElement){
        super(events, container);

        this.cashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
        this.onlinePayButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
        this.adressInputElement = ensureElement<HTMLInputElement>('.form__input', this.container);
    
        this.onlinePayButton.addEventListener('click', () => {
            this.events.emit('payment:change', { payment: 'card' })
        })
        this.cashPayButton.addEventListener('click', () => {
            this.events.emit('payment:change', { payment: 'cash' })
        })
        this.adressInputElement.addEventListener('input', () => {
            this.events.emit('address:change', { address: this.adressInputElement.value })
        })

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order:submit'); 
        });
    }

    set payment(value: TPayment){
        this.onlinePayButton.classList.toggle('button_alt-active', value === 'card');
        this.cashPayButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.adressInputElement.value = value
    }
}