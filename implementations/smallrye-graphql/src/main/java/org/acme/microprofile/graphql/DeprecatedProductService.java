package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.Map;

@ApplicationScoped
public class DeprecatedProductService {
  public DeprecatedProduct getDeprecatedProduct(String sku, String pkg) {
    return DeprecatedProduct.resolveBySkuAndPackage(sku, pkg);
  }
}
