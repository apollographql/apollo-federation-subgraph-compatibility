import { Directive, Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Directive("@shareable")
export class ProductDimension {
  @Field({ nullable: true })
  size: string;

  @Field({ nullable: true })
  weight: number;

  @Field({ nullable: true })
  @Directive("@inaccessible")
  unit: string;
}
