import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";

import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { DeprecatedProductsResolver } from "./deprecated-products.resolver";
import { DeprecatedProductsService } from "./deprecated-products.service";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";
import { ProductResearchResolver } from "./product-research.resolver";
import { ProductResearchService } from "./product-research.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      path: "/",
    }),
  ],
  providers: [
    UsersResolver,
    UsersService,
    DeprecatedProductsResolver,
    DeprecatedProductsService,
    ProductsResolver,
    ProductsService,
    ProductResearchResolver,
    ProductResearchService,
  ],
})
export class AppModule {}
