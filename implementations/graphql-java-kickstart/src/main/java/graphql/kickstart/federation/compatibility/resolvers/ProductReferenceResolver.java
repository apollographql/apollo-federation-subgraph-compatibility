package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.federation.compatibility.services.ProductService;
import java.util.HashMap;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Component
public class ProductReferenceResolver {

    public static Product resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("id") instanceof String) {
            String productId = (String) reference.get("id");
            for (Product product : ProductService.products) {
                if (product.getId()
                    .equals(productId)) {
                    return product;
                }
            }
        } else {
            String productSku = (String) reference.get("sku");

            if (reference.get("package") instanceof String) {
                String productPackage = (String) reference.get("package");
                for (Product product : ProductService.products) {
                    if (product.getSku()
                        .equals(productSku) && product.getProductPackage()
                        .equals(productPackage)) {
                        return product;
                    }
                }
            } else if (reference.get("variation") instanceof HashMap) {
                var productVariation = (HashMap) reference.get("variation");
                for (Product product : ProductService.products) {
                    if (product.getSku()
                        .equals(productSku) && product.getVariation()
                        .getId()
                        .equals(productVariation.get("id"))) {
                        return product;
                    }
                }
            }
        }

        return null;
    }
}
