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
import {AbstractFieldStrategy, AbstractModel, Binder, FieldStrategy, ModelConstructor} from "@hilla/form";

@customElement('mgnl-multi-field')
class GroceryView extends LitElement {

    @property({type: String}) label = '';
    @property({type: String}) value = '';

    // custom properties that do not work with the default Binder
    @property({type: Boolean}) mandatory = false;
    @property({type: Boolean}) hasError = false;
    @property({type: String}) error = '';

    readonly inputs: Node[] | undefined;

    private field: Node = new TextField();

    render() {
        let verticalLayout = new VerticalLayout();
        let addButton = new Button();
        verticalLayout.append(addButton)
        for (const element of this.value) {
            this.createFieldContainer(addButton, element)
        }
        addButton.innerText = "+"
        addButton.onclick = () => this.createFieldContainer(addButton, undefined);
        return verticalLayout;
    }

    private createFieldContainer(addButton: Button, value: string | undefined) {
        let horizontalLayout = new HorizontalLayout();
        let newField = this.field.cloneNode();
        this.inputs?.push(newField);
        horizontalLayout.append(newField)
        let removeButton = this.createButton();
        removeButton.onclick = () => {
            horizontalLayout.remove();
        }
        horizontalLayout.append(removeButton)
        addButton.before(horizontalLayout)
        if (newField instanceof TextField) {
            if (value) newField.value = value;
            newField.focus();
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
    //     return "this.value";
    // }

    // set value(value: string) {
    //     // this.value = value;
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
