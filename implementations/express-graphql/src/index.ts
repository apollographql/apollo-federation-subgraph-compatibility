import express from "express";
import { graphqlHTTP } from "express-graphql";
import { readFileSync } from "fs";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";

interface ProductVariation {
  id: string;
}

interface Product {
  id: string;
  sku: string;
  package: string;
  variation: ProductVariation;
}

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

const sdl = readFileSync("products.graphql", "utf-8");
const typeDefs = gql(sdl);

const resolvers = {
  Query: {
    product(_: unknown, args: { id: string }) {
      return products.find((p) => p.id == args.id);
    },
  },
  Product: {
    variation(parent: Product) {
      if (parent.variation) return { id: parent.variation };
      return { id: products.find((p) => p.id == parent.id)?.variation };
    },

    dimensions() {
      return { size: "1", weight: 1 };
    },

    createdBy() {
      return { email: "support@apollographql.com", totalProductsCreated: 1337 };
    },

    __resolveReference(productRef: Product) {
      if (productRef.id) {
        return products.find((p) => p.id == productRef.id);
      } else if (productRef.sku && productRef.package) {
        return products.find(
          (p) => p.sku == productRef.sku && p.package == productRef.package
        );
      } else {
        return products.find(
          (p) =>
            p.sku == productRef.sku && p.variation.id == productRef.variation.id
        );
      }
    },
  },
};

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const app = express();
app.use("/", graphqlHTTP({ schema }));
app.listen(process.env.PRODUCTS_PORT || 4001);
