package com.example.application.bean;

import java.util.Arrays;
import java.util.Collection;


public class Bean {

    private Collection<String> collection = Arrays.asList("1", "2");
    private String aString = "test";

    public Collection<String> getCollection() {
        return collection;
    }

    public void setCollection(Collection<String> collection) {
        this.collection = collection;
    }

    public String getaString() {
        return aString;
    }

    public void setaString(String aString) {
        this.aString = aString;
    }
}
