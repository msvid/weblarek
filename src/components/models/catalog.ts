import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
    private products: IProduct[] = [];
    private product: IProduct | null = null;
    private events: IEvents;
        
    constructor(events: IEvents) {
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:change', { products: this.products});
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | null{
        return this.products.find(product => product.id === id) || null;
    }
    
    setSelectedProduct(product: IProduct): void {
        this.product = product;
        this.events.emit('catalog:selected', { product });
        this.events.emit('catalog:change', { selectedProduct: product });
    }

    getSelectedProduct(): IProduct | null {
        return this.product;
    }
}