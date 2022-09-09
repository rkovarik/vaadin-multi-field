import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {View} from '../../views/view';
import "./mgnl-multi-field";
import {ArrayModel, Binder, field} from "@hilla/form";
import {MyBinder} from "Frontend/views/grocery/mgnl-multi-field";
import BeanModel from "Frontend/generated/com/example/application/bean/BeanModel";
import {CounterEndpoint} from "Frontend/generated/endpoints";

@customElement('grocery-view')
export class GroceryView extends View {

    private binder = new MyBinder(this, BeanModel)

    render() {
        return html`
            <div>
                <img style="width: 200px;" src="images/empty-plant.png"/>
                <h2>This place intentionally left empty</h2>
                <mgnl-multi-field value="['2']">
                    <vaadin-text-field></vaadin-text-field>
                </mgnl-multi-field>
                <vaadin-button @click="${() => this.binder.submitTo(CounterEndpoint.submit)}"></vaadin-button>
            </div>`;
    }

    //...="${field(this.binder.model.collection)}"
    //...="${field(this.binder.model._string)}"

    async firstUpdated(arg: any) {
        super.firstUpdated(arg);
        this.binder.read(await CounterEndpoint.getBean());
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
