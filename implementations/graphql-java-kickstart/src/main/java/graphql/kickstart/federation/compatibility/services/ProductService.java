package graphql.kickstart.federation.compatibility.services;

import graphql.kickstart.federation.compatibility.model.Product;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    public static List<Product> products =
        List.of(new Product("apollo-federation", "federation", "@apollo/federation", "OSS"),
            new Product("apollo-studio", "studio", "", "platform"));

    public Product getProducyById(String productId) {
        return products.stream()
            .filter(product -> product.getId()
                .equals(productId))
            .findFirst()
            .orElse(null);
    }
}

