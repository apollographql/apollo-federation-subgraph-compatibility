import { buildSubgraphSchema } from '@apollo/subgraph'
import { createServer } from '@graphql-yoga/node'
import { gql } from "graphql-tag";
import { readFileSync } from 'node:fs'

import { Product, Resolvers } from './resolvers-types'


const typeDefs = readFileSync('./products.graphql', 'utf8')

const products: Product[] = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: {
      id: "OSS",
    },
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: {
      id: "platform",
    },
  },
];

const resolvers: Resolvers = {
  Query: {
    product(_: unknown, args: { id: string }) {
      return products.find((p) => p.id == args.id)!;
    },
  },
  Product: {
    variation(parent) {
      if (parent.variation) return parent.variation;
      const p = products.find((p) => p.id == parent.id)
      return p && p.variation ? p.variation : null;
    },

    dimensions() {
      return { size: "small", weight: 1, unit: "kg" };
    },

    createdBy() {
      return { email: "support@apollographql.com", totalProductsCreated: 1337 };
    },

    __resolveReference(productRef) {
      // will be improved in the future: https://github.com/dotansimha/graphql-code-generator/pull/5645
      let ref = productRef as Product
      if (ref.id) {
        return products.find((p) => p.id == ref.id) || null;
      } else if (ref.sku && ref.package) {
        return products.find(
          (p) => p.sku == ref.sku && p.package == ref.package
        ) || null;
      } else {
        return products.find(
          (p) =>
            p.sku == ref.sku && p.variation && ref.variation && p.variation.id == ref.variation.id
        ) || null;
      }
    },
  },
  User: {
    name() {
      return "Jane Smith";
    }
  }
};

const server = createServer({
  schema: buildSubgraphSchema([{ typeDefs: gql(typeDefs), resolvers }]),
  port: process.env.PRODUCTS_PORT ? parseInt(process.env.PRODUCTS_PORT, 10) : 4001,
  endpoint: '/'
})

server.start().then(() => {
  console.log(`🚀 Server ready at http://localhost:4001`)
})
