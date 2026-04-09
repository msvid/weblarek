import './scss/styles.scss';

import { Catalog } from './components/models/catalog.ts';
import { Basket } from './components/models/basket.ts';
import { Buyer } from './components/models/buyer.ts';
import { ApiCommunication } from './components/models/apicommunication.ts';

import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { EventEmitter } from './components/base/Events';
import { IOrder, IProduct, TCardCatalog, TCardBasket } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Header } from './components/view/header.ts'
import { BasketV } from './components/view/basket.ts'
import { Gallery } from './components/view/gallery.ts'
import { Modal } from './components/view/modal.ts'

import { CardCatalog } from './components/view/card/cardCatalog.ts'
import { CardPreview } from './components/view/card/cardPreview.ts'
import { CardBasket } from './components/view/card/cardBasket.ts'

import { OrderForm } from './components/view/form/orderForm.ts'
import { ContactsForm } from './components/view/form/contactsForm.ts'
import { Success } from './components/view/success.ts'

const toCardCatalogData = (product: IProduct): TCardCatalog => ({
    category: product.category,
    image: { src: product.image, alt: product.title },
});

const toCardBasketData = (product: IProduct, index: number): TCardBasket => ({
    title: product.title,
    price: product.price,
    index,
});

const api = new Api(API_URL);
const apiComm = new ApiCommunication(api);
const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const headerElement = ensureElement<HTMLElement>('.header');
const galleryElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLElement>('.modal');


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement, events);
const header = new Header(events, headerElement);
const basketV = new BasketV(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);
const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

apiComm.getProducts()
    .then((products) => { 
        catalog.setProducts(products); 
        console.log('Каталог товаров из сервера:', catalog.getProducts());
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров с сервера:', error);
    });

events.on('cardPreview:click', () => {
    const product = catalog.getPreview();
    if (!product) return;

    if (basket.hasItem(product.id)) {
        basket.removeItem(product);
    } else {
        basket.addItem(product);
    }
    modal.close();
});

events.on('catalog:change', () => {
    const products = catalog.getProducts();
    const cardElements = products.map((product) => {
        const container = cloneTemplate(cardCatalogTemplate);
        const card = new CardCatalog(container, {
            onClick: () => events.emit('product:select', product)
        });
        return card.render(toCardCatalogData(product));
    });
    gallery.render({ catalogElement: cardElements });
});

events.on('product:select', (product: IProduct) => {
    catalog.setSelectedProduct(product);
});


events.on('catalog:item-selected', (product: IProduct) => {
    const isInBasket = basket.hasItem(product.id);
    const isUnavailable = product.price === null;

    preview.render({
        ...product,
        image: { src: product.image, alt: product.title },

        buttonText: isUnavailable
            ? 'Недоступно'
            : (isInBasket ? 'Удалить из корзины' : 'Купить'),

        disabled: isUnavailable,
    });

    modal.open(preview.render());
});

events.on('basket:open', () => {
    modal.open(basketV.render());
});

events.on('cart:change', () => {
    header.count = basket.getItemsCount();
    const items = basket.getItems().map((product, index) => {
        const container = cloneTemplate(cardBasketTemplate);
        const card = new CardBasket(container, {
            onClick: () => basket.removeItem(product)
        });
        return card.render(toCardBasketData(product, index+1));
    });

    basketV.render({ items, total: basket.getTotalPrice() });
});

events.on('basket:order', () => {
    const errors = buyer.validate();
    const data = buyer.get();

    orderForm.errors([errors.payment, errors.address].filter(Boolean).join('. '));
    orderForm.submitEnabled(!errors.payment && !errors.address);
    orderForm.selectPaymentButtonStatus(data.payment);
    orderForm.address(data.address);

    modal.open(orderForm.render());
});

events.on('payment:change', (data: { payment: 'card' | 'cash' }) => {
    buyer.setPayment(data.payment);
});

events.on('address:change', (data: { address: string }) => {
    buyer.setAddress(data.address);
});

events.on('order:submit', () => {
    const errors = buyer.validate();
    const data = buyer.get();

    contactsForm.errors([errors.email, errors.phone].filter(Boolean).join('. '));
    contactsForm.submitEnabled(!errors.email && !errors.phone);
    contactsForm.email(data.email);
    contactsForm.phone(data.phone);

    modal.open(contactsForm.render());
});

events.on('contacts:email', (data: { email: string }) => {
    buyer.setEmail(data.email);
});

events.on('contacts:phone', (data: { phone: string }) => {
    buyer.setPhone(data.phone);
});

events.on('buyer:changed', () => {
    const errors = buyer.validate();
    const data = buyer.get();

    orderForm.errors([errors.payment, errors.address].filter(Boolean).join('. '));
    orderForm.submitEnabled(!errors.payment && !errors.address);
    orderForm.selectPaymentButtonStatus(data.payment);
    orderForm.address(data.address);

    contactsForm.errors([errors.email, errors.phone].filter(Boolean).join('. '));
    contactsForm.submitEnabled(!errors.email && !errors.phone);
    contactsForm.email(data.email);
    contactsForm.phone(data.phone);
});

events.on('contacts:submit', () => {
    const orderData: IOrder = {
        ...buyer.get(),
        items: basket.getItems().map((product) => product.id),
        total: basket.getTotalPrice(),
    };

    apiComm.createOrder(orderData)
        .then((result) => {
            if (!result) return;

            basket.clear();
            buyer.clear();

            success.total = result.total;
            modal.open(success.render());
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа:', error);
        });
});

events.on('success:close', () => {
    modal.close();
});