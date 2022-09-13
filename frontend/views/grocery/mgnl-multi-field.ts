import {html, LitElement, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import '@vaadin/icon'
import "@vaadin/icons";
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

    // @property( {type: [String]}) _value = [];
    @state() private fields: HTMLElement[] = [];

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
        let inputs = [];
        let fieldTemplate = this.children.item(0);
        fieldTemplate?.removeAttribute("hidden")
        if (values) {
            for (const element of values) {
                // values.forEach(value => { //.split(this.separator)
                let field: Node | undefined = fieldTemplate?.cloneNode(true);
                // console.error("" + this.children.item(0)?.localName)
                if (field instanceof HTMLElement) {
                    field.setAttribute("value", element);
                    inputs.push(field);
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
                    ${this.renderFields()}
                </vaadin-vertical-layout>
                <vaadin-button style="width: 100%" @click="${(_ev: CustomEvent) => {
                    this.addField(_ev)
                }}">
                    <vaadin-icon icon="vaadin:plus"></vaadin-icon>
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
                this.fields.push(cloneNode)
                this.reassignFields();
            }
        }
    }

    private reassignFields() {
        let fields: any[] = []
        this.fields.forEach(field => fields.push(field))
        this.fields = fields;
    }

    private renderFields() {
        const itemTemplates = [];
        for (let i = 0; i < this.fields.length; i++) {
            let field = this.fields[i]
            let disabled = i == 0;
            itemTemplates.push(html`
                <vaadin-horizontal-layout>
                    ${field}
                    <vaadin-button ?disabled=${i == 0} @click="${(_ev: CustomEvent) => {
                        if (i > 0 && i < this.fields.length - 1) {
                            [this.fields[i], this.fields[i - 1]] = [this.fields[i - 1], this.fields[i]]
                        }
                        this.reassignFields()
                    }}">
                        <vaadin-icon icon="vaadin:angle-up"></vaadin-icon>
                    </vaadin-button>
                    <vaadin-button @click="${(_ev: CustomEvent) => {
                        this.fields.splice(this.fields.indexOf(field), 1)
                        this.reassignFields()
// this.fields = new Set(this.fields)
// let value = this.value;
// value.push('dwa')
// this.value = []
// this.value = value;
// dispatchEvent(new Event("change"))
                    }}"><vaadin-icon icon="vaadin:trash"></vaadin-icon>
                    </vaadin-button>
                    <vaadin-button ?disabled=${i == this.fields.length - 1} @click="${(_ev: CustomEvent) => {
                        if (i >= 0 && i < this.fields.length - 1) {
                            [this.fields[i], this.fields[i + 1]] = [this.fields[i + 1], this.fields[i]]
                        }
                        this.reassignFields()
                    }}">
                        <vaadin-icon icon="vaadin:angle-down"></vaadin-icon>
                    </vaadin-button>
                </vaadin-horizontal-layout>
            `);
        }
        return itemTemplates;
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


