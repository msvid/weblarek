import { Component } from "../base/Component.ts";

interface IGallery {
    catalogElement: HTMLElement[]
}

export class Gallery extends Component<IGallery> {
    constructor (container: HTMLElement) {
        super(container);
    }

    set catalog (items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    render(data: IGallery): HTMLElement {
        this.catalog = data.catalogElement;
        return this.container;
    }
}