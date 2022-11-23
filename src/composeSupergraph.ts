import execa from "execa";
import debug from "debug";
import { healthcheck } from "./utils/client";
import { logWithTimestamp, writeableDebugStream } from "./utils/logging";
import { resolve } from "path";

const roverDebug = debug("rover");

/**
 * Composes supergraph using rover dev command and introspection.
 * 
 * @param productsUrl products schema URL 
 */
export async function composeSupergraph(productsUrl: string, productsSchema?: string) {
    logWithTimestamp("composing supergraph...");
    roverDebug(`\n***********************\nComposing supergraph...\n***********************\n\n`);
    const pm2Logs = execa("pm2", ["logs"]);
    pm2Logs.stdout.pipe(writeableDebugStream(roverDebug));
    pm2Logs.stderr.pipe(writeableDebugStream(roverDebug));


    // composing supergraph
    //   cannot use supergraph.config.js as we need to run rover dev sequentially for each subgraph
    //   this is a workaround to https://github.com/apollographql/rover/issues/1258
    // TODO cleanup once multiple subgraphs could be specified with single rover dev command
    await composeSubgraph("products", productsUrl, productsSchema);
    await composeSubgraph("users", "http://localhost:4002", resolve(__dirname, "..", "subgraphs", "users", "users.graphql"));
    await composeSubgraph("inventory", "http://localhost:4003", resolve(__dirname, "..", "subgraphs", "users", "users.graphql"));

    pm2Logs.cancel();
    roverDebug(`\n***********************\nSupergraph composed...\n***********************\n\n`);
}

async function composeSubgraph(subgraphName: string, subgraphUrl: string, schemaFile?: string) {
    roverDebug(`Composing supergraph - loading ${subgraphName} schema`);

    const started = await healthcheck(subgraphName, subgraphUrl);
    if (started) {
        const params = [
            "start",
            "rover",
            "--name",
            `rover-${subgraphName}`,
            "--",
            "dev",
            "--name",
            subgraphName,
            "--url",
            subgraphUrl,
            "--supergraph-port",
            "4000"
        ];

        if (schemaFile) {
            params.push("--schema", schemaFile);
        }

        const proc = execa("pm2", params);
        proc.stdout.pipe(writeableDebugStream(roverDebug));
        proc.stderr.pipe(writeableDebugStream(roverDebug));

        await proc;

        if (proc.exitCode !== 0) {
            throw new Error(`Failed to compose supergraph - failed to load ${subgraphName} schema`);
        }
    } else {
        throw new Error(`${subgraphName} failed to start`);
    }
}
