import execa from "execa";
import debug from "debug";
import { logWithTimestamp, writeableDebugStream } from "./utils/logging";
import { composeDevSupergraph, composeSupergraph } from "./composeSupergraph";
import { healthcheckRouter } from "./utils/client";
import { resolve } from "path";

const pm2Debug = debug("pm2");
const dockerDebug = debug("docker");

export interface DockerConfig {
    kind: "docker",
    /** Docker compose file */
    composeFile: string,
    /** Schema file to be used for composition */
    schemaFile: string,
    /** GraphQL endpoint path */
    path?: string,
    /** HTTP server port */
    port?: string
}

export interface Pm2Config {
    kind: "pm2"
    /** Product subgraph endpoint */
    endpoint: string,
    /** Schema file, if omitted composition will fallback to introspection */
    schemaFile?: string,
    /** PM2 configuration file */
    configFile?: string
}

/**
 * Starts supergraph using PM2 or Docker Compose.
 * 
 * @returns shutdown hook for PM2/Docker Compose
 */
export async function startSupergraph(config: DockerConfig | Pm2Config) {
    logWithTimestamp("starting supergraph...");
    if (config.kind === "docker") {
        return startSupergraphUsingDocker(config);
    } else {
        return startSupergraphUsingPm2(config);
    }
}

async function startSupergraphUsingPm2(config: Pm2Config) {
    pm2Debug(`\n***********************\nStarting supergraph using PM2...\n***********************\n\n`);
    try {
        // start pm2 daemon to avoid race conditions
        await execa("pm2", ["ping"]);

        const pm2Logs = execa("pm2", ["logs"]);
        pm2Logs.stdout.pipe(writeableDebugStream(pm2Debug));
        pm2Logs.stderr.pipe(writeableDebugStream(pm2Debug));

    
        let productsSubgraph = null;
        if (config.configFile) {
            productsSubgraph = await startProductsSubgraphUsingPm2(config.configFile);
        }

        const proc = execa("pm2", [
            "start",
            resolve(__dirname, "..", "supergraph.config.js"),
        ]);
        proc.stdout.pipe(writeableDebugStream(pm2Debug));
        proc.stderr.pipe(writeableDebugStream(pm2Debug));

        if (productsSubgraph != null && productsSubgraph.exitCode !== 0) {
            throw new Error("Products subgraph did not start successfully");
        }

        await proc;
        if (proc.exitCode !== 0) {
            throw new Error("Subgraphs did not start successfully");
        }
    
        const started = await composeDevSupergraph(config.endpoint, config.schemaFile);
        pm2Logs.cancel();
    
        if (started) {
            return async () => {
                pm2Debug(`\n***********************\nStopping supergraph...\n***********************\n\n`);
                await shutdownSupergraphUsingPm2();
            };
        } else {
            throw new Error("Supergraph did not start successfully");
        }
    } catch(err) {
        await shutdownSupergraphUsingPm2();
        throw err;
    }
}

/**
 * Flushes PM2 logs and then stops all PM2 processes (including daemon).
 */
async function shutdownSupergraphUsingPm2() {
    const logsFlushed = await execa("pm2", ["flush"]);
    const stopped = await execa("pm2", ["kill"]);
    if (logsFlushed.exitCode !== 0 || stopped.exitCode !== 0) {
        console.error("PM2 did not shutdown correctly");
    }
}

async function startProductsSubgraphUsingPm2(configFile: string) {
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

async function startSupergraphUsingDocker(config: DockerConfig) {
    await composeSupergraph(config.schemaFile, config.path ?? "", config.port ?? "4001");
    dockerDebug(`\n***********************\nStarting supergraph using Docker Compose...\n***********************\n\n`);

    try {
        const proc = execa("docker", [
            "compose",
            "-f",
            resolve(__dirname, "..", "docker-compose.yaml"),
            "-f",
            config.composeFile,
            "up",
            "--build",
            "--detach",
        ]);
    
        proc.stdout.pipe(writeableDebugStream(dockerDebug));
        proc.stderr.pipe(writeableDebugStream(dockerDebug));
    
        await proc;
        if (proc.exitCode !== 0) {
            throw new Error("docker-compose did not start successfully");
        }
    
        const started = await healthcheckRouter();
        if (started) {
            return async () => {
                pm2Debug(`\n***********************\nStopping supergraph...\n***********************\n\n`);
                await shutdownSupergraphUsingDocker();
            };
        } else {
            throw new Error("Supergraph did not start successfully");
        }
    } catch (err) {
        await shutdownSupergraphUsingDocker();
        throw err;
    }
}

async function shutdownSupergraphUsingDocker() {
    const shutdown = await execa("docker", ["compose", "down", "--remove-orphans", "-v"]);
    if (shutdown.exitCode !== 0) {
        console.error("Docker compose did not shutdown correctly");
    }
}