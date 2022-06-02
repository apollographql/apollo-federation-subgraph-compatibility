package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.federation.compatibility.services.ProductService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class QueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ProductService productService;

    public Product getProduct(String productId) {
        return productService.getProducyById(productId);
    }

}
