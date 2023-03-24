import { Injectable } from "@nestjs/common";

import { ProductResearch } from "./product-research.model";

@Injectable()
export class ProductResearchService {
  public productResearch: ProductResearch[] = [
    {
      study: {
        caseNumber: "1234",
        description: "Federation Study",
      },
    },
    {
      study: {
        caseNumber: "1235",
        description: "Studio Study",
      },
    },
  ];
}
