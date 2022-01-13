package com.vaadin.addons.flow.components;

import java.util.Arrays;
import java.util.TimeZone;

import com.vaadin.flow.component.combobox.ComboBox;

/**
 * Simple {@link com.vaadin.flow.component.combobox.ComboBox} for selection of a {@link java.util.Locale}.
 */
public class TimezoneSelector extends ComboBox<TimeZone> {

    public TimezoneSelector() {
        setItems(TimeZone.getAvailableIDs());
        setItemLabelGenerator(timeZone -> {
            String label = timeZone.getDisplayName(getLocale());
            String displayCountry = timeZone.getDisplayName(getLocale());
            return timeZone.getDisplayName(false, TimeZone.LONG, getLocale()) + " (" + timeZone.getID() + ")";
//            return displayCountry.isEmpty() ? label : label + " (" + displayCountry + ")";
        });

    }

    public void setItems(String... items) {
        super.setItems(Arrays.stream(items).map(TimeZone::getTimeZone));
    }
}
