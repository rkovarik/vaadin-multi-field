import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {View} from '../../views/view';
import "./mgnl-multi-field";
import {Binder, field} from "@hilla/form";
import BeanModel from "Frontend/generated/com/example/application/bean/BeanModel";
import {CounterEndpoint} from "Frontend/generated/endpoints";
import {MultiFieldBinder} from "Frontend/views/grocery/mgnl-multi-field";

@customElement('grocery-view')
export class GroceryView extends View {

    private binder = new MultiFieldBinder(this, BeanModel)

    render() {
        return html`
            <div>
                <mgnl-multi-field .value="1" ...="${field(this.binder.model.aString)}">
                    <vaadin-text-field></vaadin-text-field>
                </mgnl-multi-field>
                <vaadin-button @click="${() => {
                    return this.binder.submitTo(CounterEndpoint.submit);
                }}"></vaadin-button>
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
