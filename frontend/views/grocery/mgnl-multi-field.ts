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
import {Checkbox} from "@vaadin/checkbox";
import {ComboBox} from "@vaadin/combo-box";

@customElement('mgnl-multi-field')
class GroceryView extends LitElement {

    @property({type: String}) label = '';

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) required = false;
    @property({type: String}) errorMessage = '';

    @property() separator = "\t";

    @state() private inputs: Set<Element | null> = new Set();

    get value() {
        let values = '';
        this.inputs.forEach(input => {
            // console.error(input.getElementsByTagName("input").item(0)?.value)
            let value = input?.getElementsByTagName("input").item(0)?.value;
            values += value + "\t";
        })
        return values;
    }

    set value(values) {
        let inputs = new Set<HTMLElement>(); //.clear()
        values.split(this.separator).forEach(value => {
            let field: Node | undefined = new TextField(); //this.getElementsByClassName("field").item(0)?.cloneNode();
            if (field instanceof HTMLElement) {
                console.error("" + this.getElementsByClassName("field").item(0)?.children.length)
                // if (field instanceof TextField) {
                //     field.value = value;
                // } else {
                field.setAttribute("value", value);
                // }
                inputs.add(field);
                field.focus()
            }
        })
        this.inputs = inputs;
    }

    protected createRenderRoot(): Element | ShadowRoot {
        return this;
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
                <slot class="field" style="display='none'"></slot>
                <vaadin-vertical-layout>
                    ${repeat(this.inputs, input => html`
                        <vaadin-horizontal-layout>
                            ${input}
                            <vaadin-button @click="${(_ev: CustomEvent) => {
                                this.inputs.delete(input)
                                this.inputs = new Set(this.inputs)
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

    addField(_e: CustomEvent) {
        // this.value = this.value + this.separator;
        this.inputs = new Set(this.inputs.add(new TextField()));
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


