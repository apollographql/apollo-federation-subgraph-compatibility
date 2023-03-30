import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "node:fs";
import { Resolvers } from "./resolvers-types";
import { products, deprecatedProduct, productResearch, user } from "./data";

const resolvers: Resolvers = {
  Query: {
    product(_, args) {
      return products.find((p) => p.id == args.id) || null;
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
