import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import {TextField} from "@vaadin/text-field";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {Button} from "@vaadin/button";

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
                <vaadin-button @click="${this.getOnclick}">+</vaadin-button>
            </vaadin-vertical-layout>`;
    }

    render2() {
        let layout = new VerticalLayout();
        layout.append(this.getElementsByTagName("slot")[0])
        this.assignedSlot
        // let nodes = html`<slot></slot>`;
        // layout.append(this.assignedSlot)
        // this.slot
        let button = new Button();
        button.innerText = "+";
        // button.onclick = this.getOnclick(button);
        layout.appendChild(button);
        return layout;
    }

    private getOnclick() {
        let newField = new TextField();
        // this.getElementsByClassName("slot").item(0)
        console.warn(newField)
        // this.shadowRoot?.querySelector("#slot")?.childNodes.item(0);
        if (newField) {
            this.appendChild(newField);
            // newField.focus()
        }
    }
}
