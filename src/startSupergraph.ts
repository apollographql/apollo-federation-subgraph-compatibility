import execa from "execa";
import debug from "debug";
import { logWithTimestamp, writeableDebugStream } from "./utils/logging";

const pm2Debug = debug("pm2");

/**
 * Starts all subgraphs using PM2.
 * 
 * @param pm2ConfigFile optional PM2 config file that will be used to start the subgraph
 * @returns PM2 shutdown hook
 */
export async function startSupergraph(pm2ConfigFile?: string) {
    logWithTimestamp("starting supergraph...");
    pm2Debug(`\n***********************\nStarting supergraph for testing target implementation...\n***********************\n\n`);
    // start pm2 daemon to avoid race conditions
    await execa("pm2", ["ping"]);

    const pm2Logs = execa("pm2", ["logs"]);
    pm2Logs.stdout.pipe(writeableDebugStream(pm2Debug));
    pm2Logs.stderr.pipe(writeableDebugStream(pm2Debug));

    let productsSubgraph = null;
    if (pm2ConfigFile) {
        productsSubgraph = startProductsSubgraph(pm2ConfigFile);
    }

    const proc = execa("pm2", [
        "start",
        "supergraph.config.js",
    ]);
    proc.stdout.pipe(writeableDebugStream(pm2Debug));
    proc.stderr.pipe(writeableDebugStream(pm2Debug));

    if (productsSubgraph != null) {
        await productsSubgraph;
        if (productsSubgraph.exitCode !== 0) {
            await gracefulShutdown();
            throw new Error("Products subgraph did not start successfully");
        }
    }

    await proc;
    if (proc.exitCode !== 0) {
        await gracefulShutdown();
        throw new Error("Supergraphs did not start successfully");
    }

    pm2Logs.cancel();
    return async () => {
        pm2Debug(`\n***********************\nStopping supergraph...\n***********************\n\n`);
        await gracefulShutdown();
    };
}

/**
 * Flushes PM2 logs and then stops all PM2 processes (including daemon).
 */
async function gracefulShutdown() {
    await execa("pm2", ["flush"]);
    await execa("pm2", ["kill"]);
}

async function startProductsSubgraph(configFile: string) {
    // start products subgraph
    pm2Debug(`Starting products subgraph...`);
    const productsSubgraph = execa("pm2", [
        "start",
        configFile,
    ]);

    productsSubgraph.stdout.pipe(writeableDebugStream(pm2Debug));
    productsSubgraph.stderr.pipe(writeableDebugStream(pm2Debug));
    return productsSubgraph;
}
