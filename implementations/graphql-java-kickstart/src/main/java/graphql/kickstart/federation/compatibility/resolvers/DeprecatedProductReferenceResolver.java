package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.DeprecatedProduct;
import graphql.kickstart.federation.compatibility.model.Product;
import java.util.HashMap;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Component
public class DeprecatedProductReferenceResolver {

    public static DeprecatedProduct resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("sku") instanceof String sku && reference.get("package") instanceof String pkg) {
            return DeprecatedProduct.resolveBySkuAndPackage(sku, pkg);
        }
        return null;
    }
}
