import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import {TextField} from "@vaadin/text-field";

@customElement('mgnl-multi-field')
export class GroceryView extends LitElement {

    render() {
        return html`
            <vaadin-vertical-layout class="multi-field-root">
                <vaadin-horizontal-layout>
                    <slot class="slot"></slot>
                    <vaadin-button @click="${this.getOnclick}">
                        <vaadin-icon icon="vaadin:phone"></vaadin-icon>
                    </vaadin-button>
                </vaadin-horizontal-layout>
                <vaadin-button id="add-field-button" @click="${this.getOnclick}">+</vaadin-button>
            </vaadin-vertical-layout>`;
    }

    private getOnclick() {
        let newField = this.firstElementChild?.parentElement;
        let addButton = this.shadowRoot?.getElementById("add-field-button"); //.getElementsByTagName("vaadin-horizontal-layout");
        console.warn(addButton)
        // this.shadowRoot?.querySelector("#slot")?.childNodes.item(0);
        if (newField) {
            addButton?.before(newField);
            // newField.focus()
        }
    }
}
