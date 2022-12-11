import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";

import { ProductVariation } from "./product-variation.model";
import { ProductDimension } from "./product-dimension.model";
import { User } from "./user.model";
import { ProductResearch } from "./product-research.model";

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@key(fields: "sku package")')
@Directive('@key(fields: "sku variation { id }")')
export class Product {
  @Field((type) => ID)
  id: string;

  @Field({ nullable: true })
  sku?: string;

  @Field({ nullable: true })
  package?: string;

  @Field({ nullable: true })
  variation?: ProductVariation;

  @Field({ nullable: true })
  dimensions?: ProductDimension;

  @Field({ nullable: true })
  @Directive('@provides(fields: "totalProductsCreated")')
  createdBy?: User;

  @Field({ nullable: true })
  @Directive('@tag(name: "internal")')
  notes?: string;

  @Field(type => [ProductResearch])
  research?: ProductResearch[];
}
