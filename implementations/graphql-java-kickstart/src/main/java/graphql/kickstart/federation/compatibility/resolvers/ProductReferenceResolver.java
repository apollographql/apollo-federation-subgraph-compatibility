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
        if (reference.get("id") instanceof String productId) {
            for (Product product : ProductService.products) {
                if (product.getId()
                    .equals(productId)) {
                    return product;
                }
            }
        } else if (reference.get("sku") instanceof String productSku) {
            if (reference.get("package") instanceof String productPackage) {
                for (Product product : ProductService.products) {
                    if (product.getSku()
                        .equals(productSku) && product.getProductPackage()
                        .equals(productPackage)) {
                        return product;
                    }
                }
            } else if (reference.get("variation") instanceof HashMap productVariation) {
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
