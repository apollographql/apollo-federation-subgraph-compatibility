import { readFileSync } from "fs";
import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const port = process.env.USERS_PORT || 4002;
const users = [
  {
    email: "support@apollographql.com",
    name: "Apollo Studio Support",
    totalProductsCreated: 4,
  },
];

const typeDefs = gql(readFileSync("users.graphql", "utf-8"));

const resolvers = {
  User: {
    /** @type {(reference: import("./typings").UserReference) => any} */
    __resolveReference: (reference) => {
      return users.find((u) => u.email == reference.email);
    },
  },
};
const server = new ApolloServer({
  schema: buildFederatedSchema({ typeDefs, resolvers }),
});
server
  .listen({ port })
  .then(({ url }) => console.log(`Users subgraph ready at ${url}`));
