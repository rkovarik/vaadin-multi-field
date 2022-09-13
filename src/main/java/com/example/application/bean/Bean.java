package com.example.application.bean;

import java.util.Arrays;
import java.util.Collection;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;


public class Bean {

    private Collection<String> emails = Arrays.asList("1", "2");

    @Size(min = 1, max = 2, message = "Please enter 1 or 2 email addresses")
    public Collection<String> getEmails() {
        return emails;
    }

    public void setEmails(Collection<String> emails) {
        this.emails = emails;
    }
}
