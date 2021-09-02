package com.netflix.graphql.dgs.compatibility.model;

public class ProductVariation {
    private final String id;

    public ProductVariation(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}