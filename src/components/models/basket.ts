import { IProduct } from "../../types";

export class Basket {
    private items: IProduct[] =[];

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