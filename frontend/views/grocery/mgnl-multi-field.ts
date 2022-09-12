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
import {
    AbstractFieldStrategy,
    AbstractModel,
    Binder,
    FieldStrategy,
    ModelConstructor,
    VaadinFieldStrategy
} from "@hilla/form";
import {version} from "vite";

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

    // constructor(version: any) {
    //     super();
    // }

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


