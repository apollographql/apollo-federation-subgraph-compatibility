package com.apollographql.federation.compatibility.graphqljava;

public class User {
    private final String email;
    private final Integer totalProductsCreated;

    public User(String email) {
        this.email = email;
        this.totalProductsCreated = 1337;
    }

    public String getEmail() {
        return email;
    }

    public Integer getTotalProductsCreated() {
        return totalProductsCreated;
    }
}
