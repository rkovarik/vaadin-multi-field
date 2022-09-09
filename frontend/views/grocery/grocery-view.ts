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

    private binder = new Binder(this, BeanModel)

    render() {
        return html`
            <div>
                <mgnl-multi-field ...="${field(this.binder.model.aString)}">
                    <vaadin-text-field></vaadin-text-field>
                </mgnl-multi-field>
                <vaadin-button @click="${() => this.binder.submitTo(CounterEndpoint.submit)}"></vaadin-button>
            </div>`;
    }


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
