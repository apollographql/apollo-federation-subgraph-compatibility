package graphql.kickstart.federation.compatibility.model;

import lombok.Getter;

@Getter
public class Product {

    private final String id;
    private final String sku;
    private final String productPackage;
    private final ProductVariation variation;
    private final ProductDimension dimensions;
    private final User createdBy;

    private final String notes;

    public Product(String id) {
        this.id = id;
        this.sku = "";
        this.productPackage = "";
        this.variation = new ProductVariation("");
        this.dimensions = new ProductDimension("small", 1, "unit");
        this.createdBy = new User("support@apollographql.com");
        this.notes = "";
    }

    public Product(String id, String sku, String productPackage, String variationId) {
        this.id = id;
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation(variationId);
        this.dimensions = new ProductDimension("small", 1, "unit");
        this.createdBy = new User("support@apollographql.com");
        this.notes = "";
    }

    public Product(String sku, String productPackage) {
        this.id = "";
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation("");
        this.dimensions = new ProductDimension("small", 1, "unit");
        this.createdBy = new User("support@apollographql.com");
        this.notes = "";
    }

    public Product(String sku, ProductVariation variation) {
        this.id = "";
        this.productPackage = "";
        this.sku = sku;
        this.variation = variation;
        this.dimensions = new ProductDimension("small", 1, "unit");
        this.createdBy = new User("support@apollographql.com");
        this.notes = "";
    }
}
