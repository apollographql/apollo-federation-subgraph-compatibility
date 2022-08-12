package com.netflix.graphql.dgs.compatibility.model;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class Product {
    public static List<Product> PRODUCTS = List.of(
            new Product("apollo-federation", "federation", "@apollo/federation", "OSS"),
            new Product("apollo-studio", "studio", "", "platform"));

    private final String id;
    private final String sku;
    private final String productPackage;
    private final ProductVariation variation;
    private final ProductDimension dimensions;
    private final User createdBy;

    public Product(String id, String sku, String productPackage, String variationId) {
        this.id = id;
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation(variationId);
        this.dimensions = new ProductDimension("small", 1, "kg");

        this.createdBy = User.DEFAULT_USER;
    }

    public String getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public ProductDimension getDimensions() {
        return dimensions;
    }

    public String getPackage() {
        return productPackage;
    }

    public ProductVariation getVariation() {
        return variation;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public static Product resolveById(@NotNull String productId) {
        for (Product product : PRODUCTS) {
            if (product.getId().equals(productId)) {
                return product;
            }
        }
        return null;
    }
}
