package com.example.application.bean;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class CounterEndpoint {
    /**
     * A method that adds one to the argument.
     */
    public @Nonnull Bean getBean() {
        return new Bean();
    }

    public void submit(Bean bean) {
        var string = bean.getaString();
    }
}