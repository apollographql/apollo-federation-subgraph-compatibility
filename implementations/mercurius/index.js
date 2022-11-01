const Fastify = require("fastify");
const mercurius = require("mercurius");
const fs = require("fs");
const gql = require("graphql-tag");
const { buildSubgraphSchema } = require("@apollo/subgraph");

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

const sdl = fs.readFileSync("products.graphql", "utf-8");
const typeDefs = gql(sdl);

const resolvers = {
  Query: {
    product: (_, args, context) => {
      return products.find((p) => p.id == args.id);
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
    __resolveReference: (reference) => {
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
    variation: (reference) => {
      if (reference.variation) return { id: reference.variation };
      return { id: products.find((p) => p.id == reference.id)?.variation };
    },
    dimensions: () => {
      return { size: "small", weight: 1, unit: "kg" };
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
    createdBy: () => {
      return user;
    },
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
    __resolveReference: (reference) => {
      return productResearch.find(
        (p) => reference.study.caseNumber === p.study.caseNumber
      );
    },
  },
  User: {
    averageProductsCreatedPerYear: (user, args, context) => {
      if (user.email != "support@apollographql.com") {
        throw new GraphQLError(
          "user.email was not 'support@apollographql.com'"
        );
      }
      return Math.round(user.totalProductsCreated / user.yearsOfEmployment);
    },
    __resolveReference: (reference) => {
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
          user.yearsOfEmployment = reference.yearsOfEmployment;
        }
        return user;
      } else {
        return null;
      }
    },
  },
};

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const app = Fastify();

app.register(mercurius, { schema, path: "/" });

app.listen(process.env.PRODUCTS_PORT || 4001, "0.0.0.0", (err, url) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${url}`);
});
