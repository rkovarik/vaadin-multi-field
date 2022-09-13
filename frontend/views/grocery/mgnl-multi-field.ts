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
    @property({type: String}) name = '';
    @property({type: Boolean}) required = false;
    @property({type: String}) errorMessage = '';

    @property() separator = "\t";

    @state() private fields: Set<HTMLElement> = new Set();

    get value() {
        let values = '';
        this.fields.forEach(field => {
            // console.error(input?.localName)
            let input = field.getElementsByTagName("input").item(0);
            let value
            if (input) {
                value = input?.value;
            } else {
                value = field.getElementsByTagName("textarea").item(0)?.value;
            }
            values += value + "\t";
        })
        return values;
    }

    set value(values) {
        let inputs = new Set<HTMLElement>();
        let fieldTemplate = this.children.item(0);
        fieldTemplate?.removeAttribute("hidden")

        values.split(this.separator).forEach(value => {
            let field: Node | undefined = fieldTemplate?.cloneNode(true);
            // console.error("" + this.children.item(0)?.localName)
            if (field instanceof HTMLElement) {
                field.setAttribute("value", value);
                inputs.add(field);
                field.focus()
            }
        })
        this.fields = inputs;
        // fieldTemplate?.setAttribute("hidden", "true")
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
        //TODO validation of inner fields
        return html`
            <div class="vaadin-field-container">
                <div part="label">
                    <slot name="label">${(this.label)}</slot>
                    ${required}
                </div>
                <!--                <slot class="field"></slot>-->
                <vaadin-vertical-layout>
                    ${repeat(this.fields, field => html`
                        <vaadin-horizontal-layout>
                            ${field}
                            <vaadin-button @click="${(_ev: CustomEvent) => {
                                this.fields.delete(field)
                                this.fields = new Set(this.fields)
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
        let fieldTemplate = this.children.item(0);
        if (fieldTemplate) {
            let cloneNode = fieldTemplate.cloneNode(true);
            if (cloneNode instanceof HTMLElement) {
                this.fields = new Set(this.fields.add(cloneNode));
            }
        }
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


