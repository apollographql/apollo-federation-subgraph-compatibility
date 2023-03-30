package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.Product;
import java.util.HashMap;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Component
public class ProductReferenceResolver {

    public static Product resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("id") instanceof String id) {
            return Product.resolveById(id);
        } else {
            String productSku = (String) reference.get("sku");

            if (reference.get("package") instanceof String pkg) {
                for (Product product : Product.PRODUCTS) {
                    if (product.sku().equals(productSku) && product.getPackage().equals(pkg)) {
                        return product;
                    }
                }
            } else if (reference.get("variation") instanceof HashMap variation) {
                for (Product product : Product.PRODUCTS) {
                    if (product.sku().equals(productSku)
                            && product.variation().id().equals(variation.get("id"))) {
                        return product;
                    }
                }
            }
        }

        return null;
    }
}
