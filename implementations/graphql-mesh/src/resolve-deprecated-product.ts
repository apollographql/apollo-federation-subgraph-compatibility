import { Maybe, DeprecatedProduct } from "./resolvers-types";
import { deprecatedProduct } from "./data";

// matches the product.schema#ProductResearch @key(fields: "sku package") directive
interface ProductResearchKeyFields {
  sku: DeprecatedProduct["sku"];
  package: DeprecatedProduct["package"];
}

export default (fields: ProductResearchKeyFields): Maybe<DeprecatedProduct> => {
  if (
    deprecatedProduct.sku === fields.sku &&
    deprecatedProduct.package === fields.package
  ) {
    return deprecatedProduct;
  }
  return null;
};
