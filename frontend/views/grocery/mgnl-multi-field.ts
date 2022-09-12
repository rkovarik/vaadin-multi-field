import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import '@vaadin/icon'
import {Icon} from "@vaadin/icon";
import {Button} from "@vaadin/button";
import {TextField} from "@vaadin/text-field";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {HorizontalLayout} from "@vaadin/horizontal-layout";
import {AbstractFieldStrategy, AbstractModel, Binder, FieldStrategy, ModelConstructor} from "@hilla/form";

@customElement('mgnl-multi-field')
class GroceryView extends LitElement {

    get value(): string {
        let values = ''
        this.inputs.forEach(input => {
            let value = input instanceof TextField ? input.value : input.getAttribute('value');
            values += value + '\t';
        })
        return values;
        // return this.inputs;
    }

    set value(values: string) {
        this.inputs.clear();
        // if (values != undefined) {
        values
            .split('\t')
            .forEach(value1 => {
                let field = new TextField();
                field.setAttribute("value", value1);
                this.inputs.add(field);
                return field;
            });
        // }
    }

    @state() inputs: Set<Element> = new Set();

    @property({type: String}) label = '';
    @property({type: String}) private _value = '';

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) mandatory = false;
    @property({type: Boolean}) hasError = false;
    @property({type: String}) errorMessage = 'dwa';

    render() {
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
}

export default GroceryView;

export class MultiFieldStrategy extends AbstractFieldStrategy<string> { //implements FieldStrategy<string> {

    // constructor(element: any) {
    //     super(element, undefined);
    // }

    // model?: AbstractModel<any> | undefined;
    // required: boolean;
    // invalid: boolean;
    // errorMessage: string;
    // value: any;

    set required(required: boolean) {
        this.element.required = required;
    }

    set invalid(invalid: boolean) {
        // this.element.hasError = invalid;
    }

    // get value() {
    //     if (this.element instanceof GroceryView) {
    //         console.error("get" + this.element.value)
    //         return this.value;
    //     }
    //     return '';
    // }

    // set value(value: string) {
    //     if (this.element instanceof GroceryView) {
    //         console.error("dewa" + value)
    //         this.element.value = value;
    //     }
    // }

    //
    set errorMessage(errorMessage: string) {
        this.element.errorMessage = errorMessage;
    }
    //
    // readonly model: AbstractModel<any> | undefined;
}

export class MultiFieldBinder<T, M extends AbstractModel<T>> extends Binder<T, M> {

    constructor(context: Element, model: ModelConstructor<T, M>) {
        super(context, model);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFieldStrategy(element: any): FieldStrategy {
        if (element.localName === 'mgnl-multi-field') {
            return new MultiFieldStrategy(element);
        }
        return super.getFieldStrategy(element);
    }

}
