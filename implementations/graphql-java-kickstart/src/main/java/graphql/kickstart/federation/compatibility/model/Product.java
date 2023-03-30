package graphql.kickstart.federation.compatibility.model;

import static graphql.kickstart.federation.compatibility.model.ProductResearch.FEDERATION_STUDY;
import static graphql.kickstart.federation.compatibility.model.ProductResearch.STUDIO_STUDY;
import static graphql.kickstart.federation.compatibility.model.User.DEFAULT_USER;

import java.util.ArrayList;
import java.util.List;
import org.jetbrains.annotations.NotNull;

public record Product(String id, String sku, String pkg, ProductVariation variation, ProductDimension dimensions, User createdBy, String notes, List<ProductResearch> research) {

    public static List<Product> PRODUCTS = List.of(
            new Product("apollo-federation", "federation", "@apollo/federation", "OSS", FEDERATION_STUDY),
            new Product("apollo-studio", "studio", "", "platform", STUDIO_STUDY)
    );

    public Product(String id, String sku, String pkg, String variationId, ProductResearch research) {
        this(id, sku, pkg, new ProductVariation(variationId), new ProductDimension("small", 1, "kg"), DEFAULT_USER, "", List.of(research));
    }

    public String getPackage() {
        return pkg;
    }

    public static Product resolveById(@NotNull String productId) {
        for (Product product : PRODUCTS) {
            if (product.id().equals(productId)) {
                return product;
            }
        }
        return null;
    }
}
