package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class ProductService {

  public Product getProduct(String id) {
    return Product.resolveById(id);
  }

  public static Product resolveById(String id) {
    return Product.resolveById(id);
  }

  public static Product resolveBySkuAndPackage(String sku, String pkg) {
    for (Product product : Product.PRODUCTS) {
      if (product.getSku().equals(sku) && product.getPackage().equals(pkg)) {
        return product;
      }
    }

    return null;
  }

  public static Product resolveBySkuAndVariation(String sku, Object variation) {
  if (variation instanceof HashMap v) {
        for (Product product : Product.PRODUCTS) {
          if (product.getSku().equals(sku)
              && product.getVariation().getId().equals(v.get("id"))) {
            return product;
          }
        }
      }

    return null;
  }
}