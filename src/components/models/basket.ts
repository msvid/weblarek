import { IProduct } from "../../types";
import { IEvents } from '../base/Events.ts'

export class Basket {
    private items: IProduct[] =[];
    private events: IEvents

    constructor(events: IEvents){
        this.events = events
    }

    getItems(): IProduct[] {
        return this.items
    }

    addItem(product: IProduct): void {
        this.items.push(product)
        this.events.emit<IProduct[]>('cart:change')
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item !== product)
        this.events.emit<IProduct[]>('cart:change')
    }
    
    clear(): void {
        this.items = []
        this.events.emit<IProduct[]>('cart:change')
    }

    getTotalPrice(): number {
        return this.items
            .filter(item => item.price !== null)
            .reduce((acc, item) => acc + (item.price as number), 0);
    }
    
    getItemsCount(): number {
        return this.items.length
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}