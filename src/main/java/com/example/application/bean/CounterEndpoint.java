package com.example.application.bean;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class CounterEndpoint {

    private Bean bean = new Bean();

    public @Nonnull Bean getBean() {
        return bean;
    }

    public void submit(Bean bean) {
        this.bean = bean;
    }
}