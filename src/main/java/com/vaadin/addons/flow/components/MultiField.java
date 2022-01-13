package com.vaadin.addons.flow.components;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasValue;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.customfield.CustomField;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

/**
 * Field holding {@link java.util.Collection} of values, which consist with multiple fields which can be added or deleted.
 *
 * @param <T> field value type
 */
public class MultiField<T> extends CustomField<Collection<T>> {

    private final List<HasValue<?, T>> hasValues = new ArrayList<>();
    private final VerticalLayout allFieldsLayout = new VerticalLayout();
    private final FieldGenerator<T> fieldGenerator;

    public MultiField(FieldGenerator<T> fieldGenerator) {
        super(Collections.emptyList());
        add(allFieldsLayout);
        this.fieldGenerator = fieldGenerator;
        add(fieldGenerator.createAddFieldLayout(this::addNewField));
    }

    private HasValue<?, T> addNewField() {
        final HasValue<?, T> newField = fieldGenerator.createHasValue();
        hasValues.add(newField);
        final HorizontalLayout fieldLayout = new HorizontalLayout(fieldGenerator.asComponent(newField));
        final Button deleteButton = new Button(VaadinIcon.TRASH.create(), buttonClickEvent -> {
            hasValues.remove(newField);
            allFieldsLayout.remove(fieldLayout);
            updateValue();
        });
        fieldLayout.add(deleteButton);
        deleteButton.setWidthFull();
        allFieldsLayout.add(fieldLayout);
        updateValue();
        return newField;
    }

    @Override
    protected Collection<T> generateModelValue() {
        return hasValues.stream()
                .map(HasValue::getValue)
                .collect(Collectors.toList());
    }

    @Override
    protected void setPresentationValue(Collection<T> values) {
        values.forEach(value -> {
            final HasValue<?, T> hasValue = addNewField();
            hasValue.setValue(value == null ? hasValue.getEmptyValue() : value);
        });
    }

    @FunctionalInterface
    public interface FieldGenerator<T> {

        HasValue<?, T> createHasValue();

        default Component asComponent(HasValue<?, T> hasValue) {
            return (Component) hasValue;
        }

        default Component createAddFieldLayout(Runnable addNewHasValue) {
            return new VerticalLayout(new Button(VaadinIcon.PLUS_CIRCLE.create(), buttonClickEvent -> addNewHasValue.run()));
        }
    }
}
