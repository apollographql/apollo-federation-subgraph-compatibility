package graphql.kickstart.federation.compatibility.model;

import static graphql.kickstart.federation.compatibility.model.User.DEFAULT_USER;

public record DeprecatedProduct(String sku, String pkg, String reason, User createdBy) {
    public static DeprecatedProduct DEPRECATED_PRODUCT = new DeprecatedProduct("apollo-federation-v1", "@apollo/federation-v1", "Migrate to Federation V2", DEFAULT_USER);

    public String getPackage() {
        return pkg;
    }

    public static DeprecatedProduct resolveBySkuAndPackage(String sku, String pkg) {
        if (DEPRECATED_PRODUCT.sku.equals(sku) && DEPRECATED_PRODUCT.pkg.equals(pkg))  {
            return DEPRECATED_PRODUCT;
        } else {
            return null;
        }
    }
}
