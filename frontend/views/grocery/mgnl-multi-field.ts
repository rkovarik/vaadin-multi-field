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
        let value = ''
        this.inputs.forEach(input => value += input.value + '\t')
        return value;
    }

    set value(values: string) {
        this.inputs.clear();
        // if (values != undefined) {
            values.split('\t')
                .map(value1 => {
                    let field = new TextField();
                    field.setAttribute("value", value1);
                    this.inputs.add(field);
                    return field;
                });
        // }
    }

    @property({type: String}) label = '';
    @property({type: String}) private _value = '';

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) mandatory = false;
    @property({type: Boolean}) hasError = false;
    @property({type: String}) error = '';

    @state() inputs: Set<TextField> = new Set<TextField>();

    // private field: Node = new TextField();

    render() {
        let verticalLayout = new VerticalLayout();
        let addButton = new Button();
        verticalLayout.append(addButton)
        // if (this._value) {
        //     for (const element of this._value.split('\t')) {
        //         this.createFieldContainer(addButton, element)
        //     }
        // }
        this.inputs.forEach(element => this.createFieldContainer(addButton, element))
        addButton.innerText = "+"
        addButton.onclick = () => {
            let field = new TextField();
            this.inputs.add(field);
            this.createFieldContainer(addButton, field);
        };
        return verticalLayout;
    }

    private createFieldContainer(addButton: Button, newField: TextField) {
        let horizontalLayout = new HorizontalLayout();
        // let newField = new TextField(); //this.field.cloneNode();
        // this.inputs.add(newField);
        horizontalLayout.append(newField)
        let removeButton = this.createButton();
        removeButton.onclick = () => {
            horizontalLayout.remove();
            // value?.replace(value, '');
            // this._value += value
            this.inputs.delete(newField);
        }
        horizontalLayout.append(removeButton)
        addButton.before(horizontalLayout)
        newField.focus();
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

export class MyTextFieldStrategy extends AbstractFieldStrategy<string> { //implements FieldStrategy
    // constructor(public element: GroceryView) {
    //     super();
    //     console.error("dewa")
    // }
    //
    set required(required: boolean) {
        // this.element.mandatory = required;
    }

    set invalid(invalid: boolean) {
        // this.element.hasError = invalid;
    }

    // get value() {
    //     return this.element.value;
    // }
    //
    // set value(value: string) {
    //     this.element.value = value;
    // }

    //
    // set errorMessage(errorMessage: string) {
    //     this.element.error = errorMessage;
    // }
    //
    // readonly model: AbstractModel<any> | undefined;
}

export class MyBinder<T, M extends AbstractModel<T>> extends Binder<T, M> {
    constructor(context: Element, model: ModelConstructor<T, M>) {
        super(context, model);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFieldStrategy(element: any): FieldStrategy {
        if (element.localName === 'mgnl-multi-field') {
            return new MyTextFieldStrategy(element);
        }
        return super.getFieldStrategy(element);
    }

}
