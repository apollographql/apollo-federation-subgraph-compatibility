package com.netflix.graphql.dgs.compatibility.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.compatibility.model.Product;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;

@DgsComponent
public class ProductDataFetcher {
  @DgsQuery(field = "product")
  public Product getProduct(@InputArgument String id) {
    return Product.resolveById(id);
  }

  @DgsEntityFetcher(name = "Product")
  public static Product resolveReference(@NotNull Map<String, Object> reference) {
    if (reference.get("id") instanceof String id) {
      return Product.resolveById(id);
    } else {
      String productSku = (String) reference.get("sku");

      if (reference.get("package") instanceof String pkg) {
        for (Product product : Product.PRODUCTS) {
          if (product.getSku().equals(productSku) && product.getPackage().equals(pkg)) {
            return product;
          }
        }
      } else if (reference.get("variation") instanceof HashMap variation) {
        for (Product product : Product.PRODUCTS) {
          if (product.getSku().equals(productSku)
              && product.getVariation().getId().equals(variation.get("id"))) {
            return product;
          }
        }
      }
    }

    return null;
  }
}