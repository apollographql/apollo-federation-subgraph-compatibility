package com.apollographql.federation.compatibility.graphqljava;

import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

@Component
public class GraphQLDataFetchers {
    public DataFetcher getProductDataFetcher() {
        return dataFetchingEnvironment -> {
            String productId = dataFetchingEnvironment.getArgument("id");
            return Product.products.stream().filter(product -> product.getId().equals(productId)).findFirst()
                .orElse(null);
        };
    }
}