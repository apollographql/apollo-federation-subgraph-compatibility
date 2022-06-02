package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.tools.GraphQLResolver;
import org.springframework.stereotype.Component;

@Component
public class ProductResolver implements GraphQLResolver<Product> {

    String getPackage(Product product) {
        return product.getProductPackage();
    }
}
