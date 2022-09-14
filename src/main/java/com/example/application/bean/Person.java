package com.example.application.bean;


public class Person {

    private String emails = "1,2";

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
