import { readFileSync } from "fs";
import { resolve } from "path";
import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const port = process.env.PRODUCTS_PORT || 4001;
const products = [
    { id: 'apollo-federation', sku: 'federation', package: '@apollo/federation', variation: "OSS" },
    { id: 'apollo-studio', sku: 'studio', package: '', variation: "platform" }
]

const sdl = readFileSync(resolve(__dirname, '..', 'products.graphql'), { encoding: 'utf-8' });
const typeDefs = gql(sdl);
const resolvers = {
    Query: {
        product: (_, args: { id: string }, context) => {
            return products.find(p => p.id == args.id);
        }
    },
    Product: {
        variation: (reference) => {
            if (reference.variation) return { id: reference.variation };
            return { id: products.find(p => p.id == reference.id).variation }
        },
        dimensions: () => {
            return { size: "1", weight: 1 }
        },
        createdBy: (reference) => {
            return { email: 'support@apollographql.com', totalProductsCreated: 1337 }
        },
        __resolveReference: (reference: any) => {
            if (reference.id) return products.find(p => p.id == reference.id);
            else if (reference.sku && reference.package) return products.find(p => p.sku == reference.sku && p.package == reference.package);
            else return products.find(p => p.sku == reference.sku && p.variation == reference.variation.id);
        }
    }
}
const server = new ApolloServer({ schema: buildFederatedSchema({ typeDefs, resolvers }) });
server.listen({ port }).then(({ url }) => console.log(`Products subgraph ready at ${url}`));