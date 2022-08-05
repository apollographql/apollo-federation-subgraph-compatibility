import { readFileSync } from 'fs';
import { ApolloServer, ApolloError, gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';

const port = process.env.PRODUCTS_PORT || 4001;
const products = [
  {
    id: 'apollo-federation',
    sku: 'federation',
    package: '@apollo/federation',
    variation: 'OSS',
  },
  {
    id: 'apollo-studio',
    sku: 'studio',
    package: '',
    variation: 'platform',
  },
];

const sdl = readFileSync('products.graphql', 'utf-8');

const typeDefs = gql(sdl);

const resolvers = {
  Query: {
    /** @type {(_: any, args: any, context: any) => any} */
    product: (_, args, context) => {
      return products.find((p) => p.id == args.id);
    },
  },
  Product: {
    /** @type {(reference: any) => any} */
    variation: (reference) => {
      if (reference.variation) return { id: reference.variation };
      return { id: products.find((p) => p.id == reference.id)?.variation };
    },
    dimensions: () => {
      return { size: "small", weight: 1, unit: "kg" };
    },
    createdBy: () => {
      return { email: 'support@apollographql.com', totalProductsCreated: 1337 };
    },
    /** @type {(reference: any) => any} */
    __resolveReference: (reference) => {
      if (reference.id) return products.find((p) => p.id == reference.id);
      else if (reference.sku && reference.package)
        return products.find(
          (p) => p.sku == reference.sku && p.package == reference.package
        );
      else
        return products.find(
          (p) => p.sku == reference.sku && p.variation == reference.variation.id
        );
    },
  },
  User: {
    name() {
      return "Jane Smith";
    },
    /** @type {(user: { email: String, totalProductsCreated: Number, yearsOfEmployment: Number }, args: any, context: any) => any} */
    averageProductsCreatedPerYear: (user, args, context) => {
      if (user.email != "support@apollographql.com") {
        throw new ApolloError("user.email was not 'support@apollographql.com'")
      }
      return Math.round(user.totalProductsCreated / user.yearsOfEmployment);
    },
    /** @type {(reference: any) => any} */
    __resolveReference: (reference) => {
      if (reference.email) {
        const user = { email: reference.email, name: "Jane Smith", totalProductsCreated: 1337 };
        if (reference.yearsOfEmployment) {
          // @ts-ignore
          user.yearsOfEmployment = reference.yearsOfEmployment;
        }
        return user;
      } else {
        return null;
      }
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

server
  .listen({ port })
  .then(({ url }) => console.log(`Products subgraph ready at ${url}`));
