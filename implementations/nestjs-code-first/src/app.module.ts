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
import { InventoryResolver } from "./inventory.resolver";
import { InventoryService } from "./inventory.service";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";
import { ProductResearchResolver } from "./product-research.resolver";
import { ProductResearchService } from "./product-research.service";
import { Inventory } from "./inventory.model";
import { DirectiveLocation, GraphQLDirective } from "graphql";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        orphanedTypes: [Inventory],
        directives: [
          new GraphQLDirective({
            name: 'custom',
            locations: [DirectiveLocation.OBJECT],
          })
        ]
      },
      path: "/"
    }),
  ],
  providers: [
    UsersResolver,
    UsersService,
    DeprecatedProductsResolver,
    DeprecatedProductsService,
    InventoryResolver,
    InventoryService,
    ProductsResolver,
    ProductsService,
    ProductResearchResolver,
    ProductResearchService,
  ],
})
export class AppModule { }
