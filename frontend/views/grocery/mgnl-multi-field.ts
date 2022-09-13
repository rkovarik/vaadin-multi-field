import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import '@vaadin/icon'
import {
    AbstractModel,
    Binder,
    FieldStrategy,
    ModelConstructor,
    VaadinFieldStrategy
} from "@hilla/form";

@customElement('mgnl-multi-field')
class MultiField extends LitElement {

    @property({type: String}) label = '';
    @property({type: String}) name = '';
    @property({type: Boolean}) required = false;
    @property({type: String}) errorMessage = '';

    @property() separator = "\t"; //TODO remove?

    // @property( {type: [String]}) _value = [];
    @state() private fields: Set<HTMLElement> = new Set();

    get value() {
        let values: string[] = [];
        this.fields.forEach(field => {
            let input = field.getElementsByTagName("input").item(0);
            let value;
            if (input) {
                value = input?.value;
            } else {
                value = field.getElementsByTagName("textarea").item(0)?.value;
            }
            if (value) {
                values.push(value);
            }
        })
        // console.error("value:" + values)
        return values;
    }

    set value(values) {
        let inputs = new Set<HTMLElement>();
        let fieldTemplate = this.children.item(0);
        fieldTemplate?.removeAttribute("hidden")
        if (values) {
            for (const element of values) {
                // values.forEach(value => { //.split(this.separator)
                let field: Node | undefined = fieldTemplate?.cloneNode(true);
                // console.error("" + this.children.item(0)?.localName)
                if (field instanceof HTMLElement) {
                    field.setAttribute("value", element);
                    inputs.add(field);
                    field.focus()
                }
            }
        }
        this.fields = inputs;
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
                <!--                <slot class="field"></slot>-->
                <vaadin-vertical-layout>
                    ${repeat(this.fields, field => html`
                        <vaadin-horizontal-layout>
                            ${field}
                            <vaadin-button @click="${(_ev: CustomEvent) => {
                                // field.removeAttribute("value");
                                this.fields.delete(field)
                                this.fields = new Set(this.fields)
                                // let value = this.value;
                                // value.push('dwa')
                                // this.value = []
                                // this.value = value;
                                dispatchEvent(new Event("change"))
                            }}">x
                            </vaadin-button>
                        </vaadin-horizontal-layout>
                    `)}
                </vaadin-vertical-layout>
                <vaadin-button @click="${(_ev: CustomEvent) => {
                    this.addField(_ev)
                    // this.value.push("null");
                    // this.value = Object.assign([], this.value);
                }}">+
                </vaadin-button>
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
        let fieldTemplate = this.children.item(0);
        if (fieldTemplate) {
            let cloneNode = fieldTemplate.cloneNode();
            if (cloneNode instanceof HTMLElement) {
                // let attribute = cloneNode.getAttribute("value") || '';
                // if (attribute) {}
                // this.value.push('attribute')
                // this.value = this.value
                // }
                // dispatchEvent(new Event("change"))
                cloneNode.setAttribute("value", '');
                this.fields = new Set(this.fields.add(cloneNode));
            }
        }
    }
}

export default MultiField;

export class MultiFieldBinder<T, M extends AbstractModel<T>> extends Binder<T, M> {

    constructor(context: Element, model: ModelConstructor<T, M>) {
        super(context, model); // {onChange: (ev) => console.error("" + ev)}
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFieldStrategy(element: any): FieldStrategy {
        if (element.localName === 'mgnl-multi-field') {
            return new VaadinFieldStrategy(element);
        }
        return super.getFieldStrategy(element);
    }
}


