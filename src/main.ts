import './scss/styles.scss';

import { Catalog } from './components/models/catalog.ts';
import { Basket } from './components/models/basket.ts';
import { Buyer } from './components/models/buyer.ts';
import { ApiCommunication } from './components/models/apicommunication.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { ensureElement, cloneTemplate } from "./utils/utils.ts";
import { Header } from './components/view/header.ts';
import { Gallery } from './components/view/gallery.ts';
import { EventEmitter } from './components/base/Events.ts';
import { Modal } from './components/view/modal.ts';
import { BasketView } from './components/view/basketView.ts';
import { CardCatalog } from './components/view/card/cardCatalog.ts';
import { CardPreview } from './components/view/card/cardPreview.ts';
import { CardBasket } from './components/view/card/cardBasket.ts';
import { OrderForm } from './components/view/form/orderForm.ts';
import { ContactsForm } from './components/view/form/contactsForm.ts';
import { Success } from './components/view/success.ts';
import { IProduct, TPayment} from './types/index.ts';


const events = new EventEmitter();
const api = new Api(API_URL);
const apiComm = new ApiCommunication(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery( ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('.modal'));

const basketView = new BasketView(events, cloneTemplate('#basket'));
const orderForm = new OrderForm(events, cloneTemplate('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate('#contacts'));
const success = new Success(events, cloneTemplate('#success'));
const cardPreview = new CardPreview(events, cloneTemplate('#card-preview'));

apiComm.getProducts()
    .then(products => catalog.setProducts(products))
    .catch(error => console.error('Ошибка при загрузке товаров с сервера:', error));


// МОДЕЛИ ДАННЫХ

// Изменение каталога товаров
events.on('catalog:change', () => {
    const products = catalog.getProducts();

    const cards = products.map((product) => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('catalog:selected', product)
        });
        return card.render(product);
    });

    gallery.catalog = cards;
});

// Изменение выбранного для просмотра товара
events.on('catalog:selected', (product: IProduct) => {
    catalog.setSelectedProduct(product);
    cardPreview.render(product)

    if (product.price === null) {
        cardPreview.buttonText = 'Недоступно';
        cardPreview.buttonDisabled = true;
    } else {
        const inBasket = basket.hasItem(product.id);
        cardPreview.buttonText = inBasket ? 'Удалить из корзины' : 'Купить';
        cardPreview.buttonDisabled = false;
    }

    modal.content = cardPreview.render();
    modal.open();
});

// Изменение содержимого корзины
events.on('basket:change', () => {
    header.counter = basket.getItemsCount();

    const items = basket.getItems();

    if (items.length === 0) {
        basketView.items = [];
        basketView.totalPrice = 0;
        return
    }
    const cards = items.map((product, index) => {
        const card = new CardBasket(cloneTemplate('#card-basket'), {
            onClick: () => {
                events.emit('deleteCard:delete', product);
            }
        });

        return card.render({
            ...product,
            index: index + 1
        });
    });

    basketView.items = cards;
    basketView.totalPrice = basket.getTotalPrice();
});

// Изменение данных покупателя
events.on('buyer:change', () => {
    const state = buyer.get();
    const errors = buyer.validate();

    orderForm.payment = state.payment;
    orderForm.address = state.address;

    orderForm.valid = !(errors.payment || errors.address);
    orderForm.errors(
        [errors.payment, errors.address].filter(Boolean).join(' ')
    );

    contactsForm.email = state.email;
    contactsForm.phone = state.phone;

    contactsForm.valid = !(errors.email || errors.phone);
    contactsForm.errors(
        [errors.email, errors.phone].filter(Boolean).join(' ')
    );
});


// ПРЕДСТАВЛЕНИЯ

// Добавление(удаление) товара в корзину
events.on('cardPreview:click', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    if (basket.hasItem(product.id)) {
        basket.removeItem(product);
    } else {
        basket.addItem(product);
    }

    modal.close();
});

// Нажатие кнопки удаления товара из корзины
events.on('deleteCard:delete', (product: IProduct) => {
    basket.removeItem(product);
});

// Нажатие кнопки открытия корзины
events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

// Нажатие кнопки оформления заказа
events.on('basket:order', () => {
    modal.content = orderForm.render();
});

// Нажатие кнопки перехода ко второй форме оформления заказа
events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('contacts:submit', () => {
    const orderData = {
        ...buyer.get(),
        total: basket.getTotalPrice(),
        items: basket.getItems().map(i => i.id)
    };

    apiComm.createOrder(orderData)
        .then((response) => {
            success.totalPrice = response.total;
            modal.content = success.render();
            
            basket.clear();
            buyer.clear();
        })
        .catch((error) => {
            console.error('Ошибка при создании заказа:', error);
        });
});

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('order:close', () => {
    modal.close();
});

// Изменение данных в формах
events.on('payment:change', (data: { payment: TPayment }) => {
    buyer.setPayment(data.payment);
});

events.on('address:change', (data: { address: string }) => {
    buyer.setAddress(data.address);
});

events.on('email:change', (data: { email: string }) => {
    buyer.setEmail(data.email);
});

events.on('phone:change', (data: { phone: string }) => {
    buyer.setPhone(data.phone);
});
