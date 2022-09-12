import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import '@vaadin/icon'
import {Icon} from "@vaadin/icon";
import {Button} from "@vaadin/button";
import {TextField} from "@vaadin/text-field";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {HorizontalLayout} from "@vaadin/horizontal-layout";
import {
    AbstractModel,
    Binder,
    FieldStrategy,
    ModelConstructor,
    VaadinFieldStrategy
} from "@hilla/form";

@customElement('mgnl-multi-field')
class GroceryView extends LitElement {

    @property() value = '';

    @property({type: String}) label = '';
    @property({type: String}) private _value = '';

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) required = false;
    @property({type: String}) errorMessage = '';

    @property() separator = "\t";

    render() {
        this.inputs = new Set(this.value ? this.value.split(this.separator)
            .map(value => {
                let field = new TextField();
                field.setAttribute("value", value)
                return field
            }) : []);
        let required;
        if (this.required) {
            required = html`<span ?hidden part=\"required-indicator\" aria-hidden=\"true\" on-click=\"focus\" ?visible=\"true\">*</span>`
        }
        return html`
            <div class="vaadin-field-container">
                <div part="label">
                    <slot name="label">${(this.label)}</slot>
                    ${required}
                </div>

                ${repeat(this.inputs, input => html`
                    <vaadin-horizontal-layout>
                        ${input}
<!--                        <vaadin-text-field value="${input}"></vaadin-text-field>-->
                        <vaadin-button @click="${() => {
                            this.inputs.delete(input)
                            console.warn(this.inputs)
                        }}">x
                        </vaadin-button>
                    </vaadin-horizontal-layout>
                `)}

                <vaadin-button @click="${() => this.value += this.separator}">+</vaadin-button>

                <div part="helper-text">
                    <slot name="helper"></slot>
                </div>

                <div part="error-message">
                    <slot name="error-message"></slot>
                    ${this.errorMessage}
                </div>
            </div>
        `;
    }

    @state() inputs: Set<Element> = new Set();

    render2() {
        let verticalLayout = new VerticalLayout(); //document.createElement("div"); //
        verticalLayout.className = "vaadin-field-container"

        let addButton = new Button();
        verticalLayout.append(addButton)
        this.inputs.forEach(element => this.createFieldContainer(addButton, element))
        addButton.innerText = "+"
        addButton.onclick = () => {
            let field = new TextField();
            field.required = true;
            this.inputs.add(field);
            this.createFieldContainer(addButton, field);
        };

        let slotElement = document.createElement("slot");
        slotElement.name = "error-message";
        slotElement.innerText = this.errorMessage;
        let div = document.createElement("div")
        div.append(slotElement);
        div.setAttribute("part", "error-message");
        verticalLayout.append(div);

        return verticalLayout;
    }

    private createFieldContainer(addButton: Button, newField: Element) {
        let horizontalLayout = new HorizontalLayout();
        horizontalLayout.append(newField)
        let removeButton = this.createButton();
        removeButton.onclick = () => {
            this.inputs.delete(newField);
            horizontalLayout.remove();
        }
        horizontalLayout.append(removeButton)
        addButton.before(horizontalLayout)
        newField.setAttribute('focused', 'true'); //tODO
    }

    private createButton() {
        let button = new Button();
        let icon = new Icon();
        icon.icon = "vaadin:trash"
        button.append(icon)
        button.innerText = "remove"
        return button;
    }

    public version = '1.0';

}

export default GroceryView;

class MultiFieldStrategy extends VaadinFieldStrategy {

}

export class MultiFieldBinder<T, M extends AbstractModel<T>> extends Binder<T, M> {

    constructor(context: Element, model: ModelConstructor<T, M>) {
        super(context, model);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFieldStrategy(element: any): FieldStrategy {
        // console.error(element.constructor.version)
        if (element.localName === 'mgnl-multi-field') {
            return new VaadinFieldStrategy(element);
        }
        return super.getFieldStrategy(element);
    }
}


