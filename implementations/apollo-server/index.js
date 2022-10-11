import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { GraphQLError } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';

const serverPort = parseInt(process.env.PRODUCTS_PORT || "") || 4001;

const deprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
};

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

const productResearch = [
  {
    study: {
      caseNumber: "1234",
      description: "Federation Study"
    }
  },
  {
    study: {
      caseNumber: "1235",
      description: "Studio Study"
    }
  }
]

const user = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337
 };

const sdl = readFileSync('products.graphql', 'utf-8');

const typeDefs = gql(sdl);

const resolvers = {
  Query: {
    /** @type {(_: any, args: any, context: any) => any} */
    product: (_, args, context) => {
      return products.find((p) => p.id == args.id);
    },
    /** @type {(_: any, args: any, context: any) => any} */
    deprecatedProduct: (_, args, context) => {
      if (args.sku === deprecatedProduct.sku && args.package === deprecatedProduct.package) {
        return deprecatedProduct;
      } else {
        return null;
      }
    }
  },
  DeprecatedProduct: {
    createdBy: () => {
      return user;
    },
    /** @type {(reference: any) => any} */
    __resolveReference: (reference) => {
      if (reference.sku === deprecatedProduct.sku && reference.package === deprecatedProduct.package) {
        return deprecatedProduct;
      } else {
        return null;
      }
    }
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
    /** @type {(reference: any) => any} */
    research: (reference) => {
      if (reference.id === "apollo-federation") {
        return [productResearch[0]];
      } else if (reference.id === "apollo-studio") {
        return [productResearch[1]];
      } else {
        return [];
      }
    },
    createdBy: () => {
      return user;
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
  ProductResearch: {
    /** @type {(reference: any) => any} */
    __resolveReference: (reference) => {
      return productResearch.find(
        (p) => reference.study.caseNumber === p.study.caseNumber
      );
    }
  },
  User: {
    /** @type {(user: { email: String, totalProductsCreated: Number, yearsOfEmployment: Number }, args: any, context: any) => any} */
    averageProductsCreatedPerYear: (user, args, context) => {
      if (user.email != "support@apollographql.com") {
        throw new GraphQLError("user.email was not 'support@apollographql.com'")
      }
      return Math.round(user.totalProductsCreated / user.yearsOfEmployment);
    },
    /** @type {(reference: any) => any} */
    __resolveReference: (reference) => {
      if (reference.email) {
        const user = { email: reference.email, name: "Jane Smith", totalProductsCreated: 1337 };
        if (reference.totalProductsCreated) {
          user.totalProductsCreated = reference.totalProductsCreated;
        }
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

startStandaloneServer(server, {
  listen: { port: serverPort },
}).then(({ url }) => console.log(`🚀  Products subgraph ready at ${url}`));
