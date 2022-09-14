package com.example.application.bean;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class Person {

//    @Pattern(
//            regexp = "^([_A-Za-z0-9-]+(\\\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\\\.[A-Za-z0-9]+)*(\\\\.[A-Za-z,]{2,}))*$",
//            message = "Please enter 1 or 2 email addresses"
//    )
    @NotNull
    private String emails = "private@email.com,public@email.com";

    public String getEmails() {
        return emails;
    }

    public void setEmails(String emails) {
        this.emails = emails;
    }

    //    @Size(min = 1, max = 2, message = "Please enter 1 or 2 email addresses")
//    public Collection<String> getEmails() {
//        return emails;
//    }
//
//    public void setEmails(Collection<String> emails) {
//        this.emails = emails;
//    }
}
