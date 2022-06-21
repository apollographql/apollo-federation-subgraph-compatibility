package com.apollographql.federation.compatibility;

import com.apollographql.federation.compatibility.model.Product;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ProductController {

    @QueryMapping
    public Product product(@Argument String id) {
        return Product.resolveById(id);
    }
}
