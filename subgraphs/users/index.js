import { readFileSync } from "fs";
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';

const serverPort = parseInt(process.env.USERS_PORT || "") || 4002;
const users = [
  {
    email: "support@apollographql.com",
    name: "Apollo Studio Support",
    totalProductsCreated: 10,
    yearsOfEmployment: 10
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
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: serverPort },
}).then(({ url }) => console.log(`🚀  Users subgraph ready at ${url}`));