import {
  Args,
  Query,
  Resolver,
  ResolveField,
  ResolveReference,
  ID,
} from "@nestjs/graphql";

import { Product } from "./product.model";
import { ProductsService } from "./products.service";
import { ProductDimension } from "./product-dimension.model";
import { User } from "./user.model";

@Resolver(Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query((returns) => Product, { nullable: true })
  product(@Args("id", { type: () => ID }) id: string) {
    return this.productsService.findById(id);
  }

  @ResolveField("dimensions", (returns) => ProductDimension, { nullable: true })
  getDimensions() {
    return { size: "small", weight: 1, unit: "kg" };
  }

  @ResolveField("createdBy", (returns) => User, { nullable: true })
  getCreatedBy() {
    return { email: "support@apollographql.com", totalProductsCreated: 1337 };
  }

  @ResolveReference()
  public resolveReference(reference: Product) {
    const { products } = this.productsService;
    if (reference.id) {
      return products.find((p) => p.id == reference.id);
    } else if (reference.sku && reference.package) {
      return products.find(
        (p) => p.sku == reference.sku && p.package == reference.package,
      );
    } else {
      return products.find(
        (p) =>
          p.sku == reference.sku && p.variation.id == reference.variation.id,
      );
    }
  }
}
