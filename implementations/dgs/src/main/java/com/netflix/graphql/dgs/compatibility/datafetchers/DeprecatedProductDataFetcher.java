package com.netflix.graphql.dgs.compatibility.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.compatibility.model.DeprecatedProduct;
import java.util.Map;
import org.jetbrains.annotations.NotNull;

@DgsComponent
public class DeprecatedProductDataFetcher {

  @DgsQuery(field = "deprecatedProduct")
  public DeprecatedProduct getDeprecatedProduct(@InputArgument String sku, @InputArgument("package") String pkg) {
    return DeprecatedProduct.resolveBySkuAndPackage(sku, pkg);
  }

  @DgsEntityFetcher(name = "DeprecatedProduct")
  public static DeprecatedProduct resolveReference(@NotNull Map<String, Object> reference) {
    if (reference.get("sku") instanceof String sku && reference.get("package") instanceof String pkg) {
      return DeprecatedProduct.resolveBySkuAndPackage(sku, pkg);
    }
    return null;
  }
}