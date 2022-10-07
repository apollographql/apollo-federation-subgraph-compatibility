import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "node:fs";
import { Product, ProductResearch, Resolvers, User } from "./resolvers-types";

const productResearch: ProductResearch[] = [
  {
    study: {
      caseNumber: "1234",
      description: "Federation Study",
    },
  },
  {
    study: {
      caseNumber: "1235",
      description: "Studio Study",
    },
  },
];

const products: Product[] = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: { id: "OSS", __typename: "ProductVariation" },
    research: [], // will resolve
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: { id: "platform", __typename: "ProductVariation" },
    research: [], // will resolve
  },
];

const deprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
};

const user: User = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337,
  yearsOfEmployment: 10,
};

const resolvers: Resolvers = {
  Query: {
    product(_, args) {
      return products.find((p) => p.id == args.id) || null;
    },
    resolveProduct(_, args) {
      if (args.id) {
        return products.find((product) => product.id === args.id) || null;
      }
      if (args.sku && args.package) {
        return (
          products.find(
            (product) =>
              product.sku === args.sku && product.package === args.package
          ) || null
        );
      }
      if (args.sku && args.variationId) {
        return (
          products.find(
            (product) =>
              product.sku === args.sku &&
              product.variation?.id === args.variationId
          ) || null
        );
      }
      return null;
    },
    resolveProductResearch(_, args) {
      return (
        productResearch.find(
          (p) => p.study.caseNumber === args.studyCaseNumber
        ) || null
      );
    },
    deprecatedProduct(_, args) {
      if (
        args.sku === deprecatedProduct.sku &&
        args.package === deprecatedProduct.package
      ) {
        return deprecatedProduct;
      } else {
        return null;
      }
    },
  },
  DeprecatedProduct: {
    createdBy() {
      return user;
    },
  },
  Product: {
    variation(parent) {
      if (parent.variation) return parent.variation;
      const p = products.find((p) => p.id == parent.id);
      return p && p.variation ? p.variation : null;
    },

    research: (reference) => {
      if (reference.id === "apollo-federation") {
        return [productResearch[0]];
      } else if (reference.id === "apollo-studio") {
        return [productResearch[1]];
      } else {
        return [];
      }
    },

    dimensions() {
      return { size: "small", weight: 1, unit: "kg" };
    },

    createdBy() {
      return user;
    },
  },
  User: {
    averageProductsCreatedPerYear(user) {
      if (user.email != "support@apollographql.com") {
        throw new Error("user.email was not 'support@apollographql.com'");
      }
      return Math.round(
        (user.totalProductsCreated || 0) / user.yearsOfEmployment
      );
    },
    name() {
      return "Jane Smith";
    },
  },
};

export default makeExecutableSchema({
  typeDefs: readFileSync("./products.graphql", "utf8"),
  resolvers,
});
