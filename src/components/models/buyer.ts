import { IBuyer, TPayment, TBuyerErrors } from "../../types"
import { IEvents } from "../base/Events";


export class Buyer {
    private payment: TPayment = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';
    private events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('buyer:change', { field: 'payment', value: payment });
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:change', { field: 'address', value: address });
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:change', { field: 'phone', value: phone });
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:change', { field: 'email', value: email });
    }

    get(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        }
    }

    clear(): void {
        this.payment = null
        this.address = ''
        this.phone = ''
        this.email = ''
        this.events.emit('buyer:clear');
        this.events.emit('buyer:change');
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {}
        if(this.payment === null) {
            errors.payment = 'Не выбран способ оплаты'
        }
        if(this.address === '') {
            errors.address = 'Укажите адрес доставки'
        }
        if(this.phone === '') {
            errors.phone = 'Укажите номер телефона'
        }
        if(this.email === '') {
            errors.email = 'Укажите email'
        }
        return errors
    }
}