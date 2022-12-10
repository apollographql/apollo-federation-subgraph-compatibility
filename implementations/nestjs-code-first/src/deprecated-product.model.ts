import { Directive, Field, ObjectType } from "@nestjs/graphql";

import { User } from "./user.model";

@ObjectType()
@Directive('@key(fields: "sku package")')
export class DeprecatedProduct {
  @Field()
  sku: string;

  @Field()
  package: string;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  createdBy?: User;
}
