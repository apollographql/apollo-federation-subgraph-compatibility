import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";

import { UsersResolver } from "./users.resolver";
import { ProductsResolver } from "./products.resolver";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ["**/*.graphql"],
      path: "/",
    }),
  ],
  providers: [UsersResolver, ProductsResolver],
})
export class AppModule {}
