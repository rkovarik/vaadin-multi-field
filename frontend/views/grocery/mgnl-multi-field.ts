import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import '@vaadin/icon'
import {Icon} from "@vaadin/icon";
import {Button} from "@vaadin/button";
import {TextField} from "@vaadin/text-field";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {HorizontalLayout} from "@vaadin/horizontal-layout";
import {field} from "@hilla/form";

@customElement('mgnl-multi-field')
export class GroceryView extends LitElement {

    private field: Node = new TextField();

    render() {
        let verticalLayout = new VerticalLayout();
        let button = new Button();
        this.createFieldContainer(button);
        button.innerText = "+"
        button.onclick = ev => this.createFieldContainer(button);
        verticalLayout.append(button)
        return verticalLayout;
    }

    private createFieldContainer(addButton: Button) {
        let horizontalLayout = new HorizontalLayout();
        let newField = this.field.cloneNode();
        horizontalLayout.append(newField)
        addButton.before(horizontalLayout)
        if (newField instanceof TextField) {
            newField.focus();
        }
    }

    render2() {
        return html`
            <vaadin-vertical-layout class="multi-field-root">
                <vaadin-horizontal-layout id="multi-field-container">
                    <slot class="slot"></slot>
                    <vaadin-button @click="${this.removeField}">
                        <vaadin-icon icon="vaadin:trash"></vaadin-icon>
                    </vaadin-button>
                </vaadin-horizontal-layout>
                <vaadin-button id="add-field-button" @click="${this.addField}">+</vaadin-button>
            </vaadin-vertical-layout>`;
    }

    private addField() { new Button().onclick
        let newFieldContainer = new TextField(); // this.shadowRoot?.getElementById("multi-field-container")?.cloneNode(true)
        let allFieldsContainer = this.firstElementChild?.parentElement //.shadowRoot?.getElementById("multi-field-root"); //.getElementsByTagName("vaadin-horizontal-layout");
        console.warn(allFieldsContainer)
        if (newFieldContainer) {
            allFieldsContainer?.append(newFieldContainer);
            // newField.focus()
        }
    }

    private removeField() {
        this.shadowRoot?.getElementById("multi-field-container")?.remove();
    }
}
