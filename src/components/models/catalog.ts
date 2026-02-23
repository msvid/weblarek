import { IProduct } from "../../types";

export class Catalog {
    private products: IProduct[] = [];
    private product: IProduct | null = null;

    setProducts(products: IProduct[]): void {
        this.products = products
    }

    getProducts(): IProduct[] {
        return this.products
    }

    getProductById(id: string): IProduct | null{
        return this.products.find(product => product.id === id) || null;
    }
    
    setSelectedProduct(product: IProduct): void {
        this.product = product
    }

    getSelectedProduct(): IProduct | null {
        return this.product
    }
}