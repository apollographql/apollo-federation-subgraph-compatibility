package com.netflix.graphql.dgs.compatibility.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.compatibility.model.Product;


@DgsComponent
public class ProductQuery {

  @DgsQuery(field = "product")
  public Product getProduct(@InputArgument String id) {
    return Product.getProductById(id);
  }

}