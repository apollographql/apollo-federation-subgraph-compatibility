import {
  Args,
  Query,
  Resolver,
  ResolveField,
  ResolveReference,
} from "@nestjs/graphql";

import { User } from "./user.model";
import { DeprecatedProduct } from "./deprecated-product.model";
import { DeprecatedProductsService } from "./deprecated-products.service";
import { UsersService } from "./users.service";

@Resolver(DeprecatedProduct)
export class DeprecatedProductsResolver {
  constructor(
    private readonly deprecatedProductsService: DeprecatedProductsService,
    private readonly usersService: UsersService,
  ) {}

  @Query((returns) => DeprecatedProduct, {
    nullable: true,
    deprecationReason: "Use product query instead",
  })
  deprecatedProduct(
    @Args("sku") sku: string,
    @Args("package") packageName: string,
  ) {
    const deprecatedProduct =
      this.deprecatedProductsService.deprecatedProducts[0];
    return sku === deprecatedProduct.sku &&
      packageName === deprecatedProduct.package
      ? deprecatedProduct
      : null;
  }

  @ResolveField((of) => User)
  public createdBy() {
    return this.usersService.users[0];
  }

  @ResolveReference()
  public resolveReference(reference: DeprecatedProduct) {
    const deprecatedProduct =
      this.deprecatedProductsService.deprecatedProducts[0];
    return reference.sku === deprecatedProduct.sku &&
      reference.package === deprecatedProduct.package
      ? deprecatedProduct
      : null;
  }
}
