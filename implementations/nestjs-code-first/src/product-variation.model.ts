import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProductVariation {
  @Field((type) => ID)
  id: string;
}
