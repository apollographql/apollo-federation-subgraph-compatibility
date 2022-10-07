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

const products: Omit<Product, "research">[] = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: { id: "OSS", __typename: "ProductVariation" },
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: { id: "platform", __typename: "ProductVariation" },
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
    product(_: unknown, args: { id: string }) {
      return products.find((p) => p.id == args.id)! as unknown as Product;
    },
    resolveProduct(_: unknown, args: { id: string, sku: string, package: string, variationId: string }) {
      if (args.id) {
        return products.find((product) => product.id === args.id);
      }
      if (args.sku && args.package) {
        return products.find((product) => product.sku === args.sku && product.package === args.package);
      }
      if (args.sku && args.variationId) {
        return products.find((product) => product.sku === args.sku && product.variation?.id === args.variationId);
      }
    },
    resolveProductResearch: (_: unknown, args: { studyCaseNumber: string }) => {
      return productResearch.find(
        (p) => p.study.caseNumber === args.studyCaseNumber
      );
    },
    deprecatedProduct: (_, args, context) => {
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
    createdBy: () => {
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
    averageProductsCreatedPerYear: (user, args, context) => {
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
