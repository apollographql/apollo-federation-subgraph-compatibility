package com.apollographql.federation.compatibility.graphqljava;

import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Map;

public class Product {
    private final String id;
    private final String sku;
    private final String productPackage;
    private final ProductVariation variation;
    private final ProductDimension dimensions;

    private static List<Product> products = List.of(
            new Product("apollo-federation", "federation", "@apollo/federation", "OSS"),
            new Product("apollo-studio", "studio", "", "platform"));

    public Product(String id) {
        this.id = id;
        this.sku = "";
        this.productPackage = "";
        this.variation = new ProductVariation("");
        this.dimensions = new ProductDimension("1", 1);
    }

    public Product(String id, String sku, String productPackage, String variationId) {
        this.id = id;
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation(variationId);
        this.dimensions = new ProductDimension("1", 1);
    }

    public Product(String sku, String productPackage) {
        this.id = "";
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation("");
        this.dimensions = new ProductDimension("1", 1);
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

    public static Product resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("id") instanceof String) {
            String productId = (String) reference.get("id");
            for (Product product : products) {
                if (product.getId().equals(productId)) {
                    return product;
                }
            }
        }

        if (reference.get("sku") instanceof String && reference.get("package") instanceof String) {
            String productSku = (String) reference.get("sku");
            String productPackage = (String) reference.get("package");
            for (Product product : products) {
                if (product.getId().equals(productSku) && product.getPackage().equals(productPackage)) {
                    return product;
                }
            }

        }

        return null;
    }
}