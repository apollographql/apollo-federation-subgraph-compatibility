package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class ProductService {

  public Product getProduct(String id) {
    return Product.resolveById(id);
  }

  public static Product resolveReference(Map<String, Object> reference) {
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