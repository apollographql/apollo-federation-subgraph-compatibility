import { Maybe, ProductResearch } from "./resolvers-types";
import { productResearch } from "./data";

// matches the product.schema#ProductResearch @key(fields: "study { caseNumber }") directive
interface ProductResearchKeyFields {
  study: ProductResearch["study"];
}

export default (fields: ProductResearchKeyFields): Maybe<ProductResearch> => {
  if ("study" in fields) {
    return (
      productResearch.find(
        (p) => p.study.caseNumber === fields.study.caseNumber
      ) || null
    );
  }
  return null;
};
