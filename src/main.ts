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

apiComm.getProducts()
    .then(products => catalog.setProducts(products))
    .catch(error => console.error('Ошибка при загрузке товаров с сервера:', error));


// МОДЕЛИ ДАННЫХ

// Изменение каталога товаров
events.on('catalog:change', () => {
    const products = catalog.getProducts();

    const cards = products.map((product) => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => catalog.setSelectedProduct(product)
        });

        Object.assign(card, {
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category
        });

        return card.render();
    });

    gallery.catalog = cards;
});

// Изменение выбранного для просмотра товара
events.on('catalog:selected', ({ product }: { product: IProduct }) => {
    const card = new CardPreview(events, cloneTemplate('#card-preview'));
    
    Object.assign(card, {
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        text: product.description
    });

    if (product.price === null) {
        card.buttonText = 'Недоступно';
        card.buttonDisabled = true;
    } else {
        const inBasket = basket.hasItem(product.id);
        card.buttonText = inBasket ? 'Удалить из корзины' : 'Купить';
    }

    modal.content = card.render();
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
        const card = new CardBasket(events, cloneTemplate('#card-basket'));
        
        Object.assign(card, {
            title: product.title,
            price: product.price,
            index: index + 1
        });
        
        card.id = product.id;

        return card.render();
    });

    basketView.items = cards;
    basketView.totalPrice = basket.getTotalPrice();
});

// Изменение данных покупателя
events.on('buyer:change', () => {
    const errors = buyer.validate();

    if (currentForm === 'order') {
        orderForm.valid = !(errors.payment || errors.address);
        orderForm.errors([errors.payment, errors.address].filter(Boolean).join(' '));
    }

    if (currentForm === 'contacts') {
        contactsForm.valid = !(errors.email || errors.phone);
        contactsForm.errors([errors.email, errors.phone].filter(Boolean).join(' '));
    }
});


// ПРЕДСТАВЛЕНИЯ

// Выбор карточки для просмотра
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
events.on('deleteCard:delete', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        basket.removeItem(product);
    }
});

// Нажатие кнопки открытия корзины
events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

// Нажатие кнопки оформления заказа
let currentForm: 'order' | 'contacts' | null = null;

events.on('basket:order', () => { 
    modal.content = orderForm.render();
    currentForm = 'order';
    const errors = buyer.validate();

    orderForm.valid = !(errors.payment || errors.address);
    orderForm.errors(
        [errors.payment, errors.address].filter(Boolean).join(' ')
    );
});

// Нажатие кнопки перехода ко второй форме оформления заказа и нажатие кнопки оплаты/завершения оформления заказа
events.on('form:submit', () => {
    if (currentForm === 'order') {
        const errors = buyer.validate();

        if (errors.payment || errors.address) {
            orderForm.errors('Заполните все поля');
            return;
        }

        currentForm = 'contacts';

        modal.content = contactsForm.render();
        modal.open();

        const state = buyer.get();

        contactsForm.email = state.email;
        contactsForm.phone = state.phone;

        const e = buyer.validate();
        contactsForm.valid = !(e.email || e.phone);
        return;
    }

    if (currentForm === 'contacts') {
        const state = buyer.get();
        const errors = buyer.validate();

        if (errors.email || errors.phone) {
            contactsForm.errors('Заполните все поля');
            return;
        }

        apiComm.createOrder({
            ...state,
            total: basket.getTotalPrice(),
            items: basket.getItems().map(i => i.id)
        });

        success.totalPrice = basket.getTotalPrice();
        modal.content = success.render();

        basket.clear();
        buyer.clear();
        currentForm = null;
    }
});

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('order:close', () => {
    modal.close();
    currentForm = null;
});

// Изменение данных в формах
events.on('payment:change', (data: { payment: TPayment }) => {
    buyer.setPayment(data.payment);
    orderForm.payment = data.payment;
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
