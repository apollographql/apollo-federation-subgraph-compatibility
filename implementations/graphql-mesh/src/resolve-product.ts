import { Maybe, Product } from "./resolvers-types";
import { products } from "./data";

// matches the product.schema#Product @key directives
type ProductKeyFields =
  | { id: Product["id"] } // @key(fields: "id")
  | { sku: Product["sku"]; package: Product["package"] } // @key(fields: "sku package")
  | { sku: Product["sku"]; variation: Product["variation"] }; // @key(fields: "sku variation { id }")

export default (fields: ProductKeyFields): Maybe<Product> => {
  if ("id" in fields) {
    return products.find((product) => product.id === fields.id) || null;
  }
  if ("sku" in fields && "package" in fields) {
    return (
      products.find(
        (product) =>
          product.sku === fields.sku && product.package === fields.package
      ) || null
    );
  }
  if ("sku" in fields && "variation" in fields) {
    return (
      products.find(
        (product) =>
          product.sku === fields.sku &&
          product.variation?.id === fields.variation?.id
      ) || null
    );
  }
  return null;
};
