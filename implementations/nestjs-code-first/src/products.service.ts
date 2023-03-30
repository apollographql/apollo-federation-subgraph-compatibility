import { Injectable } from "@nestjs/common";

import { Product } from "./product.model";

@Injectable()
export class ProductsService {
  public products: Product[] = [
    {
      id: "apollo-federation",
      sku: "federation",
      package: "@apollo/federation",
      variation: {
        id: "OSS",
      },
    },
    {
      id: "apollo-studio",
      sku: "studio",
      package: "",
      variation: {
        id: "platform",
      },
    },
  ];

  findById(id: string): Product {
    return this.products.find((product) => product.id === id);
  }
}
