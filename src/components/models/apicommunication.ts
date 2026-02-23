import { IApi, IProductList, IOrder, IOrderRes, IProduct } from "../../types";

export class ApiCommunication {
    api: IApi;

    constructor(api: IApi) {
        this.api = api
    }

    async getProducts(): Promise<IProduct[]>{
        const data = await this.api.get<IProductList>('/product/');
        return data.items;
    }

    async createOrder(orderData: IOrder): Promise<IOrderRes> {
        return await this.api.post('/order/', orderData);
    }
}