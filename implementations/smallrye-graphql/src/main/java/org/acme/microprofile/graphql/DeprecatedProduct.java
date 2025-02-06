package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.federation.Key;
import io.smallrye.graphql.api.federation.FieldSet;
import org.eclipse.microprofile.graphql.NonNull;

@Key(fields = @FieldSet("sku package"))
public class DeprecatedProduct {
    public static DeprecatedProduct DEPRECATED_PRODUCT = new DeprecatedProduct("apollo-federation-v1", "@apollo/federation-v1", "Migrate to Federation V2");

    @NonNull
    private final String sku;
    @NonNull
    private final String pkg;
    private final String reason;
    private final User createdBy;
    public DeprecatedProduct(String sku, String pkg, String reason) {
        this.sku = sku;
        this.pkg = pkg;
        this.reason = reason;
        this.createdBy = User.DEFAULT_USER;
    }

    @NonNull
    public String getSku() {
        return sku;
    }

    @NonNull
    public String getPackage() {
        return pkg;
    }

    public String getReason() {
        return reason;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public static DeprecatedProduct resolveBySkuAndPackage(String sku, String pkg) {
        if (DEPRECATED_PRODUCT.sku.equals(sku) && DEPRECATED_PRODUCT.pkg.equals(pkg))  {
            return DEPRECATED_PRODUCT;
        } else {
            return null;
        }
    }
}
