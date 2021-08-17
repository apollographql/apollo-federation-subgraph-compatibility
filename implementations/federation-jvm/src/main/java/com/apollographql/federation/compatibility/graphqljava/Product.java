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
    private final User createdBy;

    public static List<Product> products = List.of(
            new Product("apollo-federation", "federation", "@apollo/federation", "OSS"),
            new Product("apollo-studio", "studio", "", "platform"));

    public Product(String id) {
        this.id = id;
        this.sku = "";
        this.productPackage = "";
        this.variation = new ProductVariation("");
        this.dimensions = new ProductDimension("1", 1);

        this.createdBy = new User("support@apollographql.com");
    }

    public Product(String id, String sku, String productPackage, String variationId) {
        this.id = id;
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation(variationId);
        this.dimensions = new ProductDimension("1", 1);
        this.createdBy = new User("support@apollographql.com");
    }

    public Product(String sku, String productPackage) {
        this.id = "";
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation("");
        this.dimensions = new ProductDimension("1", 1);
        this.createdBy = new User("support@apollographql.com");
    }

    public Product(String sku, ProductVariation variation) {
        this.id = "";
        this.productPackage = "";
        this.sku = sku;
        this.variation = variation;
        this.dimensions = new ProductDimension("1", 1);
        this.createdBy = new User("support@apollographql.com");
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

    public static Product resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("id") instanceof String) {
            String productId = (String) reference.get("id");
            for (Product product : products) {
                if (product.getId().equals(productId)) {
                    return product;
                }
            }
        } else {
            String productSku = (String) reference.get("sku");

            if (reference.get("package") instanceof String) {
                String productPackage = (String) reference.get("package");
                for (Product product : products) {
                    if (product.getSku().equals(productSku) && product.getPackage().equals(productPackage)) {
                        return product;
                    }
                }
            } else {
                ProductVariation productVariation = (ProductVariation) reference.get("variation");
                for (Product product : products) {
                    if (product.getSku().equals(productSku) && product.getVariation().equals(productVariation)) {
                        return product;
                    }
                }
            }
        }

        return null;
    }
}