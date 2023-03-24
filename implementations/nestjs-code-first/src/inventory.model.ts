import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";
import { DeprecatedProduct } from "./deprecated-product.model";

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@interfaceObject')
export class Inventory {
    @Field((type) => ID)
    id: string;

    @Field(type => [DeprecatedProduct])
    deprecatedProducts?: DeprecatedProduct[];
}
