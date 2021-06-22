import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import { resolve } from "path";

const port = process.env.GATEWAY_PORT || 4000;
const supergraphSdl = readFileSync(resolve(__dirname, '..', 'supergraph.graphql'), { encoding: "utf-8" });
const gateway = new ApolloGateway({ supergraphSdl });
const server = new ApolloServer({
    gateway,
    subscriptions: false
});

server.listen({ port }).then(({ url }) => console.log(`Graph Router Ready at ${url}`));