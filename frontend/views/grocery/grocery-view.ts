import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {View} from '../../views/view';
import "./mgnl-multi-field";
import {ArrayModel, Binder, field} from "@hilla/form";

@customElement('grocery-view')
export class GroceryView extends View {

    private binder = new Binder(this, ArrayModel);

    render() {
        this.binder.read([])
        return html`
            <div>
                <img style="width: 200px;" src="images/empty-plant.png"/>
                <h2>This place intentionally left empty</h2>
                <p>It’s a place where you can grow your own UI 🤗</p>
                <mgnl-multi-field>
                    <vaadin-text-field ...="${field(this.binder.model)}"></vaadin-text-field>
                </mgnl-multi-field>
                <vaadin-button @click="${this.binder.validate}"></vaadin-button>
            </div>`;
    }
    connectedCallback() {
        super.connectedCallback();
        this.classList.add(
            'flex',
            'flex-col',
            'h-full',
            'items-center',
            'justify-center',
            'p-l',
            'text-center',
            'box-border'
        );
    }
}
