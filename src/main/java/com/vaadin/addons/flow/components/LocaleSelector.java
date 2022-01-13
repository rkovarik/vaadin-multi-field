package com.vaadin.addons.flow.components;

import java.util.Locale;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.data.renderer.IconRenderer;

/**
 * Simple {@link com.vaadin.flow.component.combobox.ComboBox} for selection of a {@link Locale}.
 */
public class LocaleSelector extends ComboBox<Locale> {

    public LocaleSelector() {
        setItems(Locale.getAvailableLocales());
        setItemLabelGenerator(locale -> { //TODO extract
            String label = locale.getDisplayLanguage(locale);
            String displayCountry = locale.getDisplayCountry(locale);
            return displayCountry.isEmpty() ? label : label + " (" + displayCountry + ")";
        });
        setRenderer(new IconRenderer<>(locale -> VaadinIcon.FLAG.create(), getItemLabelGenerator()));
    }
}
