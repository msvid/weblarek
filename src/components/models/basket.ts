import { IProduct } from "../../types";

export class Basket {
    items: IProduct[] =[];

    getItems(): IProduct[] {
        return this.items
    }

    addItem(product: IProduct): void {
        this.items.push(product)
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item !== product)
    }
    
    clear(): void {
        this.items = []
    }

    getTotalPrice(): number {
        let total = 0
        this.items.forEach(item => {
            if (item.price !== null) {
                total += item.price;
            }
        })
        return total
    }
    
    getItemsCount(): number {
        return this.items.length
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}