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
    return Product.getProductById(id);
  }

  @DgsEntityFetcher(name = "Product")
  public static Product resolveReference(@NotNull Map<String, Object> reference) {
    if (reference.get("id") instanceof String) {
      String productId = (String) reference.get("id");
      for (Product product : Product.products) {
        if (product.getId().equals(productId)) {
          return product;
        }
      }
    } else {
      String productSku = (String) reference.get("sku");

      if (reference.get("package") instanceof String) {
        String productPackage = (String) reference.get("package");
        for (Product product : Product.products) {
          if (product.getSku().equals(productSku) && product.getPackage().equals(productPackage)) {
            return product;
          }
        }
      } else if (reference.get("variation") instanceof HashMap) {
        var productVariation = (HashMap) reference.get("variation");
        for (Product product : Product.products) {
          if (product.getSku().equals(productSku)
              && product.getVariation().getId().equals(productVariation.get("id"))) {
            return product;
          }
        }
      }
    }

    return null;
  }
}