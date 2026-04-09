import { IProduct } from "../../types";
import { IEvents } from '../base/Events.ts'

export class Catalog {
    private products: IProduct[] = [];
    private product: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents){
        this.events = events
    }

    setProducts(products: IProduct[]): void {
        this.products = [...products];
        this.events.emit('catalog:change');
    }

    getProducts(): IProduct[] {
        return this.products
    }

    getProductById(id: string): IProduct | null{
        return this.products.find(product => product.id === id) || null;
    }
    
    setSelectedProduct(product: IProduct): void {
        this.product = product
        this.events.emit<IProduct>('catalog:item-selected', product)
    }

    getSelectedProduct(): IProduct | null {
        return this.product
    }

    setPreview(product:  IProduct | null) {
        this.product = product;
    }

    getPreview(): IProduct | null {
        return this.product;
    }
}