import express from "express";
import { graphqlHTTP } from "express-graphql";
import { readFileSync } from "fs";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";
import { GraphQLError } from "graphql";

interface ProductVariation {
  id: string;
}

interface Product {
  id: string;
  sku: string;
  package: string;
  variation: ProductVariation;
}

interface User {
  email: string;
  name: string;
  totalProductsCreated: number;
  yearsOfEmployment: number;
}

interface DeprecatedProduct {
  sku: string;
  package: string;
  reason: string;
  createdBy?: User;
}

interface CaseStudy {
  caseNumber: string;
  description: string;
}

interface ProductResearch {
  study: CaseStudy;
}

const deprecatedProduct: DeprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
};

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

const user: User = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337,
  yearsOfEmployment: 0,
};

const sdl = readFileSync("products.graphql", "utf-8");
const typeDefs = gql(sdl);

const resolvers = {
  Query: {
    product(_: unknown, args: { id: string }) {
      return products.find((p) => p.id == args.id);
    },

    deprecatedProduct(_: unknown, args: { sku: string; package: string }) {
      return args.sku === deprecatedProduct.sku &&
        args.package === deprecatedProduct.package
        ? deprecatedProduct
        : null;
    },
  },

  Product: {
    variation(parent: Product) {
      if (parent.variation) return { id: parent.variation };
      return { id: products.find((p) => p.id == parent.id)?.variation };
    },

    dimensions() {
      return { size: "small", weight: 1, unit: "kg" };
    },

    research(product: Product) {
      if (product.id === "apollo-federation") {
        return [productResearch[0]];
      } else if (product.id === "apollo-studio") {
        return [productResearch[1]];
      } else {
        return [];
      }
    },

    createdBy() {
      return user;
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

  DeprecatedProduct: {
    createdBy() {
      return user;
    },

    __resolveReference(deprecatedProductRef: DeprecatedProduct) {
      return deprecatedProductRef.sku === deprecatedProduct.sku &&
        deprecatedProductRef.package === deprecatedProduct.package
        ? deprecatedProduct
        : null;
    },
  },

  ProductResearch: {
    __resolveReference(productResearchRef: ProductResearch) {
      return productResearch.find(
        (p) => productResearchRef.study.caseNumber === p.study.caseNumber
      );
    },
  },

  User: {
    averageProductsCreatedPerYear(user: User) {
      if (user.email != "support@apollographql.com") {
        throw new GraphQLError(
          "user.email was not 'support@apollographql.com'",
          {}
        );
      }
      return Math.round(user.totalProductsCreated / user.yearsOfEmployment);
    },

    __resolveReference(userRef: User) {
      if (userRef.email) {
        const user = {
          email: userRef.email,
          name: "Jane Smith",
          totalProductsCreated: 1337,
          yearsOfEmployment: 0,
        };
        if (userRef.totalProductsCreated) {
          user.totalProductsCreated = userRef.totalProductsCreated;
        }
        if (userRef.yearsOfEmployment) {
          user.yearsOfEmployment = userRef.yearsOfEmployment;
        }
        return user;
      } else {
        return null;
      }
    },
  },
};

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const app = express();
app.use("/", graphqlHTTP({ schema }));
app.listen(process.env.PRODUCTS_PORT || 4001);
