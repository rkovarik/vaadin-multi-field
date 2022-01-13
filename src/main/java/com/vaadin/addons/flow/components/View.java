package com.vaadin.addons.flow.components;

import java.util.Arrays;
import java.util.Collection;
import java.util.function.Supplier;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasValue;
import com.vaadin.flow.component.HasValueAndElement;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.datetimepicker.DateTimePicker;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.Label;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.renderer.IconRenderer;
import com.vaadin.flow.router.Route;

@Route("")
public class View extends FlexLayout {

    public View() {
        setSizeFull();

        final MultiField<String> emails = new MultiField<>(EmailField::new);
        emails.setLabel("Emails2");
        final Label statusLabel = new Label("");

        final MultiField<VaadinIcon> icons = new MultiField<>(() -> {
            final ComboBox<VaadinIcon> comboBox = new ComboBox<>(null, VaadinIcon.values());
            comboBox.setRenderer(new IconRenderer<>(VaadinIcon::create));
            return comboBox;
        });
        icons.setLabel("Select relevant icons");

        final MultiField<Object> mixedFields = new MultiField<>(new MultiField.FieldGenerator<Object>() {

            private final ComboBox<Supplier<HasValueAndElement<?, ?>>> type = new ComboBox<>(null,
                    TextField::new, Checkbox::new, DateTimePicker::new
            );

            @Override
            public HasValue<?, Object> createHasValue() {
                return (HasValue<?, Object>) type.getValue().get();
            }

            @Override
            public Component createAddFieldLayout(Runnable addNewHasValue) {
                type.setPlaceholder("Add new field...");
                type.setItemLabelGenerator(supplier -> supplier.get().getElement().getTag());
                type.addValueChangeListener(event -> {
                    if (event.getValue() != null) {
                        addNewHasValue.run();
                        event.getHasValue().setValue(null);
                    }
                });
                final HorizontalLayout layout = new HorizontalLayout(type);
                layout.setMargin(true);
                return layout;
            }
        });
        mixedFields.setLabel("Mixed fields");

        final Binder<Person> binder = new Binder<>(Person.class);

        binder.forField(emails)
                .asRequired("Add at least one item")
                .withStatusLabel(statusLabel)
                .bind("emails");

        binder.forField(icons).bind("icons");
        binder.forField(mixedFields).bind("mixed");

        final Person person = new Person();
        person.setEmails(Arrays.asList("persona@company.com", null));
        person.setIcons(Arrays.asList(VaadinIcon.PLUS_SQUARE_O, null, VaadinIcon.ALT_A));
        binder.readBean(person);

        final FormLayout formLayout = new FormLayout(emails, icons, mixedFields);
        formLayout.setSizeFull();
        add(formLayout);
    }

    public static class Person {

        private Collection<String> emails;
        private Collection<VaadinIcon> icons;
        private Collection<Object> mixed;

        public Collection<String> getEmails() {
            return emails;
        }

        public void setEmails(Collection<String> emails) {
            this.emails = emails;
        }

        public Collection<VaadinIcon> getIcons() {
            return icons;
        }

        public void setIcons(Collection<VaadinIcon> icons) {
            this.icons = icons;
        }

        public Collection<Object> getMixed() {
            return mixed;
        }

        public void setMixed(Collection<Object> mixed) {
            this.mixed = mixed;
        }
    }
}
