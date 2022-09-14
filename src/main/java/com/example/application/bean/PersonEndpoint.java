package com.example.application.bean;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class PersonEndpoint {

    private Person person = new Person();

    public @Nonnull Person getBean() {
        return person;
    }

    public void submit(Person person) {
        this.person = person;
    }
}