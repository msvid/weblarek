import './scss/styles.scss';

import { Catalog } from './components/models/catalog.ts';
import { Basket } from './components/models/basket.ts';
import { Buyer } from './components/models/buyer.ts';
import { ApiCommunication } from './components/models/apicommunication.ts';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api.ts';

// Проверяем класс Catalog
const productsModel = new Catalog();

productsModel.setProducts(apiProducts.items);

console.log('Массив товаров из каталога: ', productsModel.getProducts())

//Проверяем Basket
const basket = new Basket();

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);

console.log('Товары в корзине:', basket.getItems());
console.log('Проверка наличия товара в корзине:', basket.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

basket.removeItem(apiProducts.items[0]);
console.log('Товары в корзине после удаления:', basket.getItems());

basket.clear();
console.log('Товары в корзине после очистки:', basket.getItems());

//Проверяем Buyer
const buyer = new Buyer();

buyer.setPayment('card');
buyer.setEmail('test@example.com');
buyer.setPhone('1234567890');
buyer.setAddress('г. Москва, ул. Пушкина, д.1');

console.log('Данные покупателя после сохранения:', buyer.get());

console.log('Результат валидации покупателя:', buyer.validate());

buyer.clear();
console.log('Данные покупателя после очистки:', buyer.get());

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
const apiComm = new ApiCommunication(api);

apiComm.getProducts().then((products) => {
    productsModel.setProducts(products);
    console.log('Каталог товаров из сервера:', productsModel.getProducts());
});
