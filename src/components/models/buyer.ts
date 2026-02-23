import { IBuyer, TPayment, TBuyerErrors } from "../../types"

export class Buyer {
    private payment: TPayment = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setEmail(email: string): void {
        this.email = email;
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