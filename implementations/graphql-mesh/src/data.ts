import { Product, ProductResearch, User } from "./resolvers-types";

export const products: Product[] = [
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

export const deprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
};

export const productResearch: ProductResearch[] = [
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

export const user: User = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337,
  yearsOfEmployment: 10,
};
