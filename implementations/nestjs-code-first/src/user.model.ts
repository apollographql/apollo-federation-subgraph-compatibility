import { Directive, Field, ID, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
@Directive('@key(fields: "email")')
export class User {
  @Field({ nullable: true })
  @Directive('@override(from: "users")')
  name?: string;

  @Field((type) => ID)
  @Directive("@external")
  email: string;

  @Field((type) => Int, { nullable: true })
  @Directive("@external")
  totalProductsCreated?: number;

  @Field((type) => Int)
  @Directive("@external")
  yearsOfEmployment: number;
}
