package com.example.application.bean;

import java.util.Arrays;
import java.util.Collection;

import javax.annotation.RegEx;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


public class Bean {

    private Collection<String> collection = Arrays.asList("1", "2");

    @NotEmpty
    private String aString = "\t1\t2\t";

    @Size(min = 1, max = 2)
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
