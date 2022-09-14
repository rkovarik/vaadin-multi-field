import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {View} from '../../views/view';
import "./mgnl-multi-field";
import "@vaadin/checkbox"
import "@vaadin/combo-box"
import "@vaadin/date-picker"
import "@vaadin/email-field"
import "@vaadin/text-area"
import "@vaadin/number-field"
import {Binder, field} from "@hilla/form";
import {PersonEndpoint} from "Frontend/generated/endpoints";
import MultiField, {MultiFieldBinder} from "Frontend/views/grocery/mgnl-multi-field";
import PersonModel from "Frontend/generated/com/example/application/bean/PersonModel";
import MgnlMultiField from "Frontend/views/grocery/mgnl-multi-field";

@customElement('grocery-view')
export class GroceryView extends View {

    private binder = new MultiFieldBinder(this, PersonModel)

    render() {
        return html`
            <vaadin-form-layout>
                <mgnl-multi-field label="Emails" ...="${field(this.binder.model.emails)}">
                    <vaadin-email-field required autofocus></vaadin-email-field>
                </mgnl-multi-field>
                <vaadin-button style="width: 100%" @click="${() => {
                    this.binder.submitTo(PersonEndpoint.submit)
                    return this.binder.submitTo(PersonEndpoint.submit);
                }}">
                    <vaadin-icon icon="vaadin:user-check"></vaadin-icon>
                </vaadin-button>
            </vaadin-form-layout>`;
    }


    async firstUpdated(arg: any) {
        super.firstUpdated(arg);
        this.binder.read(await PersonEndpoint.getBean());
        // let multiField = this.getElementsByTagName("mgnl-multi-field").item(0);
        // if (multiField instanceof MgnlMultiField) {
        //     multiField.addField()
        // }
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
