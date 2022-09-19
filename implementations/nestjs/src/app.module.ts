import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";

import { UsersResolver } from "./users.resolver";
import { ProductsResolver } from "./products.resolver";
import { ProductResearchResolver } from "./product-research.resolver";
import { DeprecatedProductsResolver } from "./deprecated-products.resolver";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ["**/*.graphql"],
      path: "/",
    }),
  ],
  providers: [
    UsersResolver,
    ProductsResolver,
    ProductResearchResolver,
    DeprecatedProductsResolver,
  ],
})
export class AppModule {}
