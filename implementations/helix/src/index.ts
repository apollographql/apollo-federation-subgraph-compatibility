import express from "express";
import { readFileSync } from "fs";
import { buildSubgraphSchema } from "@apollo/subgraph";
import {
  getGraphQLParameters,
  processRequest,
  sendResult,
} from "graphql-helix";
import gql from "graphql-tag";

const deprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
};

const products = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: "OSS",
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: "platform",
  },
];

const productResearch = [
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

const user = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337,
};

const inventory = {
  id: "apollo-oss",
  deprecatedProducts: [deprecatedProduct]
}

const sdl = readFileSync("products.graphql", "utf-8");

const typeDefs = gql(sdl);

const resolvers = {
  Query: {
    product: (_: any, args: any, context: any) => {
      return products.find((p) => p.id == args.id);
    },
    deprecatedProduct: (_: any, args: any, context: any) => {
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
    __resolveReference: (reference: any) => {
      if (
        reference.sku === deprecatedProduct.sku &&
        reference.package === deprecatedProduct.package
      ) {
        return deprecatedProduct;
      } else {
        return null;
      }
    },
  },
  Product: {
    variation: (reference: any) => {
      if (reference.variation) return { id: reference.variation };
      return { id: products.find((p) => p.id == reference.id)?.variation };
    },
    dimensions: () => {
      return { size: "small", weight: 1, unit: "kg" };
    },
    research: (reference: any) => {
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
    __resolveReference: (reference: any) => {
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
    __resolveReference: (reference: any) => {
      return productResearch.find(
        (p) => reference.study.caseNumber === p.study.caseNumber
      );
    },
  },
  User: {
    averageProductsCreatedPerYear: (user: any, args: any, context: any) => {
      if (user.email != "support@apollographql.com") {
        throw new Error("user.email was not 'support@apollographql.com'");
      }
      return Math.round(user.totalProductsCreated / user.yearsOfEmployment);
    },
    __resolveReference: (reference: any) => {
      if (reference.email) {
        const user = {
          email: reference.email,
          name: "Jane Smith",
          totalProductsCreated: 1337,
        };
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
    },
  },
  Inventory: {
    __resolveReference: (reference: any) => {
      if (inventory.id === reference.id) {
        return inventory;
      } else {
        return null;
      }
    }
  }
};

const app = express();

app.use(express.json());

app.use("/", async (req: any, res: any) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };
  const { operationName, query, variables } = getGraphQLParameters(request);
  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });
  sendResult(result, res);
});

const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});
