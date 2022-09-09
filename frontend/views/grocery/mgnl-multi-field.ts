import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@vaadin/custom-field';
import '@vaadin/text-field'
import '@vaadin/vertical-layout'
import '@vaadin/icon'
import {Icon} from "@vaadin/icon";
import {Button} from "@vaadin/button";
import {TextField} from "@vaadin/text-field";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {HorizontalLayout} from "@vaadin/horizontal-layout";
import {AbstractModel, Binder, FieldStrategy, ModelConstructor} from "@hilla/form";

@customElement('mgnl-multi-field')
class GroceryView extends LitElement {

    @property({type: String}) label = '';
    @property({type: [String]}) value = [];

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) mandatory = false;
    @property({type: Boolean}) hasError = false;
    @property({type: String}) error = '';

    private field: Node = new TextField();

    // render() {
    //     return html`${this.error}`;
    // }

    render() {
        // console.error("dewa" + this.value.values().next())
        let verticalLayout = new VerticalLayout();
        let addButton = new Button();
        verticalLayout.append(addButton)
        // this.createFieldContainer(addButton, this.value)
        for (const element of this.value) {
            this.createFieldContainer(addButton, element)
        }
        // this.value.forEach(value => this.createFieldContainer(addButton, value));
        addButton.innerText = "+"
        addButton.onclick = () => this.createFieldContainer(addButton, undefined);
        return verticalLayout;
    }

    private createFieldContainer(addButton: Button, value: string | undefined) {
        let horizontalLayout = new HorizontalLayout();
        let newField = this.field.cloneNode();
        horizontalLayout.append(newField)
        let removeButton = this.createButton();
        removeButton.onclick = () => horizontalLayout.remove()
        horizontalLayout.append(removeButton)
        addButton.before(horizontalLayout)
        if (newField instanceof TextField) {
            if (value) newField.value = value;
            newField.focus();
            // this.value.push(newField);
        }
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

export class MyTextFieldStrategy implements FieldStrategy {
    constructor(public element: GroceryView) {
    }

    set required(required: boolean) {
        this.element.mandatory = required;
    }

    set invalid(invalid: boolean) {
        this.element.hasError = invalid;
    }

    set errorMessage(errorMessage: string) {
        this.element.error = errorMessage;
    }

    readonly model: AbstractModel<any> | undefined;
    value: any;
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
