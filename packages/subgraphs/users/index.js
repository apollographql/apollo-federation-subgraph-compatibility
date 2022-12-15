import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { resolve } from 'path';

const serverPort = parseInt(process.env.USERS_PORT || '') || 4002;
const users = [
  {
    email: 'support@apollographql.com',
    name: 'Apollo Studio Support',
    totalProductsCreated: 10,
    yearsOfEmployment: 10,
  },
];

const typeDefs = gql(
  readFileSync(resolve(__dirname, 'users.graphql'), 'utf-8'),
);

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
}).then(({ url }) => {
  if (process.send) {
    process.send('ready');
  }
  console.log(`🚀  Users subgraph ready at ${url}`);
});
