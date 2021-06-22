import { readFileSync } from "fs";
import { resolve } from "path";
import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const port = process.env.USERS_PORT || 4002;
const users = [
    { email: 'support@apollographql.com', name: "Apollo Studio Support", totalProductsCreated: 4 }
]

interface UserReference {
    email: string;
}

const typeDefs = gql(readFileSync(resolve(__dirname, '..', '..', 'src', 'subgraphs', 'users.graphql'), { encoding: 'utf-8' }));
const resolvers = {
    User: {
        __resolveReference: (reference: UserReference) => {
            return users.find(u => u.email == reference.email);
        }
    }
}
const server = new ApolloServer({ schema: buildFederatedSchema({ typeDefs, resolvers }) });
server.listen({ port }).then(({ url }) => console.log(`Users subgraph ready at ${url}`));