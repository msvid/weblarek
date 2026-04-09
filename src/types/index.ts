export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash' | null

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[]
}

export interface IOrderRes {
    id: string;
    total: number;
}

export type ICardImage = {
    src: string;
    alt: string;
}

export type ICardAction = {
    onClick: () => void;
}

export type ICardPreview = Omit<IProduct, 'image'> & {
    image: ICardImage;
    buttonText?: string;
    disabled?: boolean;
};

export interface IBasketData {
    items: HTMLElement[],
    total: number
}

export type TCardBasket = Pick<IProduct, 'title' | 'price'> & {index: number}


export type TCardCatalog = Pick<IProduct, 'title'| 'price' |'category'> & {image: ICardImage};
