import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

import { createData } from "./data.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./type-defs.js";

const {
    NEO4J_URI = "neo4j://localhost:7687/neo4j",
    NEO4J_USERNAME = "neo4j",
    NEO4J_PASSWORD = "password",
} = process.env;

const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
);

await createData(driver);

const neo4jgraphql = new Neo4jGraphQL({ typeDefs, resolvers, driver });

const schema = await neo4jgraphql.getSubgraphSchema();

const server = new ApolloServer({
    schema,
});

await startStandaloneServer(server, {
    listen: { port: 4001 },
});
