package com.apollographql.federation.compatibility.graphqljava;

public class ProductVariation {
    private final String id;

    public ProductVariation(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}