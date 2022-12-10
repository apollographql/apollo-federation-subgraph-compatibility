import { Injectable } from "@nestjs/common";

import { DeprecatedProduct } from "./deprecated-product.model";

@Injectable()
export class DeprecatedProductsService {
  public deprecatedProducts: DeprecatedProduct[] = [
    {
      sku: "apollo-federation-v1",
      package: "@apollo/federation-v1",
      reason: "Migrate to Federation V2",
    },
  ];
}
