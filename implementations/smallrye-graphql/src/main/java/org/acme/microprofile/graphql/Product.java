package org.acme.microprofile.graphql;

import java.util.ArrayList;
import java.util.List;
import io.smallrye.graphql.api.federation.Key;
import io.smallrye.graphql.api.federation.FieldSet;
import io.smallrye.graphql.api.federation.Provides;
import io.smallrye.graphql.api.federation.Tag;
import io.smallrye.graphql.api.AdaptToScalar;
import io.smallrye.graphql.api.Scalar;
import org.eclipse.microprofile.graphql.NonNull;
import org.eclipse.microprofile.graphql.Id;

@Key(fields = @FieldSet("id"))
@Key(fields = @FieldSet("sku package"))
@Key(fields = @FieldSet("sku variation { id }"))
@CustomDirective
public class Product {
    public static List<Product> PRODUCTS = List.of(
            new Product("apollo-federation", "federation", "@apollo/federation", "OSS"),
            new Product("apollo-studio", "studio", "", "platform"));

    @NonNull @Id
    private final String id;
    private final String sku;
    private final String productPackage;
    private final ProductVariation variation;
    private final ProductDimension dimensions;
    @Provides(fields = @FieldSet("totalProductsCreated"))
    private final User createdBy;
    @Tag(name = "internal")
    private final String notes;
    @NonNull
    private final List<@NonNull ProductResearch> research;

    public Product(String id, String sku, String productPackage, String variationId) {
        this.id = id;
        this.sku = sku;
        this.productPackage = productPackage;
        this.variation = new ProductVariation(variationId);
        this.dimensions = new ProductDimension("small", 1, "kg");
        this.notes = null;
        this.research = new ArrayList<>();

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

    public String getNotes(){
        return notes;
    }

    @NonNull
    public List<ProductResearch> getResearch() {
        return research;
    }

    public static Product resolveById(String productId) {
        for (Product product : PRODUCTS) {
            if (product.getId().equals(productId)) {
                return product;
            }
        }
        return null;
    }
}
