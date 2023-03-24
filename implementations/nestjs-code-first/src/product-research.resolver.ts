import {
  Resolver,
  ResolveReference,
} from "@nestjs/graphql";

import { ProductResearch } from "./product-research.model";
import { ProductResearchService } from "./product-research.service";

@Resolver(ProductResearch)
export class ProductResearchResolver {
  constructor(
    private readonly productResearchService: ProductResearchService,
  ) {}

  @ResolveReference()
  public resolveReference(reference: ProductResearch) {
    const { productResearch } = this.productResearchService;
    return productResearch.find(
      (p) => reference.study.caseNumber === p.study.caseNumber,
    );
  }
}
