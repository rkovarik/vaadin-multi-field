package com.example.application.bean;

import java.util.Arrays;
import java.util.Collection;


public class Bean {

    private Collection<String> collection = Arrays.asList("1", "2");
    private String string = "test";

    public Collection<String> getCollection() {
        return collection;
    }

    public void setCollection(Collection<String> collection) {
        this.collection = collection;
    }

    public String getString() {
        return string;
    }

    public void setString(String string) {
        this.string = string;
    }
}
