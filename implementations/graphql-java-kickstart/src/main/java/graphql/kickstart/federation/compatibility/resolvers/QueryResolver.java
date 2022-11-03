package graphql.kickstart.federation.compatibility.resolvers;

import static graphql.kickstart.federation.compatibility.model.DeprecatedProduct.DEPRECATED_PRODUCT;

import graphql.annotations.annotationTypes.GraphQLName;
import graphql.kickstart.federation.compatibility.model.DeprecatedProduct;
import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

@Component
public class QueryResolver implements GraphQLQueryResolver {

    public Product getProduct(String productId) {
        return Product.resolveById(productId);
    }

    public DeprecatedProduct getDeprecatedProduct(String sku, @GraphQLName("package") String pkg) {
        return DeprecatedProduct.resolveBySkuAndPackage(sku, pkg);
    }

}
