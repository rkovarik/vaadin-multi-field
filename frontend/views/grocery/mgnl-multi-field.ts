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

    // render() {
    //     return html`
    //         <vaadin-vertical-layout>
    //             <slot></slot>
    //             <vaadin-text-field class="template"></vaadin-text-field>
    //             <vaadin-button onclick="">+</vaadin-button>
    //         </vaadin-vertical-layout>`;
    // }

    render() {
        let layout = new VerticalLayout();
        layout.append(this.getElementsByTagName("slot")[0])
        this.assignedSlot
        // let nodes = html`<slot></slot>`;
        // layout.append(this.assignedSlot)
        // this.slot
        let button = new Button();
        button.innerText = "+";
        button.onclick = () => {
            let newField = new TextField(); //layout.firstChild?.cloneNode();
            button.before(newField)
            newField.focus()
            // if (newField) {
            //     layout.replaceChild(newField, button);
            //     layout.appendChild(button);
            // }
        };
        layout.appendChild(button);
        return layout;
    }

}
