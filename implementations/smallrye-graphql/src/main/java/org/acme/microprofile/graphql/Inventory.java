package org.acme.microprofile.graphql;

import java.util.List;
import java.util.Map;
import io.smallrye.graphql.api.federation.Key;
import io.smallrye.graphql.api.federation.FieldSet;
import io.smallrye.graphql.api.federation.InterfaceObject;

@Key(fields = @FieldSet("id"), resolvable = true)
@InterfaceObject
public class Inventory {

    private final String id;
    private final List<DeprecatedProduct> deprecatedProducts;

    public Inventory(String id) {
        this.id = id;
        this.deprecatedProducts = List.of(DeprecatedProduct.DEPRECATED_PRODUCT);
    }

    public String getId() {
        return id;
    }

    public List<DeprecatedProduct> getDeprecatedProducts() {
        return deprecatedProducts;
    }

    public static Inventory resolveById(String id) {
        if ("apollo-oss".equals(id)) {
            return new Inventory(id);
        }
        return null;
    }
}
