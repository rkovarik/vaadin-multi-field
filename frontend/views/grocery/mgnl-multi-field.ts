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

    @property({type: String}) label = '';

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) required = false;
    @property({type: String}) errorMessage = '';

    @property() separator = "\t";

    @state() private inputs: Set<HTMLElement> = new Set();

    get value() {
        let values = '';
        this.inputs.forEach(input => {
            let value = input instanceof TextField ? input.value : input.getAttribute("value");
            values += value + "\t";
        })
        return values;
    }

    set value(values) {
        this.inputs.clear()
        values.split(this.separator).forEach(value => {
            // console.error(this.getRootNode({ composed: true}))
            let field: any = this.getRootNode().lastChild?.childNodes.item(1).childNodes.item(1).cloneNode(); //new TextField(); TODO
            if (field instanceof HTMLElement) {
                if (field instanceof TextField) {
                    field.value = value;
                } else {
                    field.setAttribute("value", value);
                }
                this.inputs.add(field);
                field.focus()
            }
        })
    }

    render() {
        let required;
        if (this.required) {
            required = html`<span ?hidden part=\"required-indicator\" aria-hidden=\"true\" on-click=\"focus\"
                                  ?visible=\"true\">*</span>`
        }
        return html`
            <div class="vaadin-field-container">
                <div part="label">
                    <slot name="label">${(this.label)}</slot>
                    ${required}
                </div>
                <!--                <slot class="field"></slot>-->
                <vaadin-vertical-layout>
                    ${repeat(this.inputs, input => html`
                        <vaadin-horizontal-layout>
                            ${input}
                                <!--                            <vaadin-text-field value="${input.getAttribute("value")}
                                "></vaadin-text-field>-->
                            <vaadin-button @click="${(_ev: CustomEvent) => {
                                // if (_ev.target  instanceof Button) {
                                //     console.error(_ev.target.getElementsByTagName("vaadin-horizontal-layout").item(0))
                                // }
                                this.inputs.delete(input)
                            }}">x
                            </vaadin-button>
                        </vaadin-horizontal-layout>
                    `)}
                </vaadin-vertical-layout>
                <vaadin-button @click="${this.addField}">+</vaadin-button>

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

    addField(e: CustomEvent) {
        this.inputs.add(new TextField());
    }
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


