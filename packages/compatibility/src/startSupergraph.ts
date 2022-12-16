import execa from 'execa';
import debug from 'debug';
import { logWithTimestamp, writeableDebugStream } from './utils/logging';
import { composeDevSupergraph, composeSupergraph } from './composeSupergraph';
import { healtcheckSupergraph } from './utils/client';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

const pm2Debug = debug('pm2');
const dockerDebug = debug('docker');

export interface DockerConfig {
  kind: 'docker';
  /** Docker compose file */
  composeFile: string;
  /** Schema file to be used for composition */
  schemaFile: string;
  /** GraphQL endpoint path */
  path?: string;
  /** HTTP server port */
  port?: string;
  /** Report format */
  format: string
}

export interface Pm2Config {
  kind: 'pm2';
  /** Product subgraph endpoint */
  endpoint: string;
  /** Schema file, if omitted composition will fallback to introspection */
  schemaFile?: string;
  /** PM2 configuration file */
  configFile?: string;
  /** Report format */
  format: string
}

/**
 * Starts supergraph using PM2 or Docker Compose.
 *
 * @returns shutdown hook for PM2/Docker Compose
 */
export async function startSupergraph(config: DockerConfig | Pm2Config) {
  logWithTimestamp('starting supergraph...');
  if (config.kind === 'docker') {
    return startSupergraphUsingDocker(config);
  } else {
    return startSupergraphUsingPm2(config);
  }
}

async function startSupergraphUsingPm2(config: Pm2Config) {
  pm2Debug(
    `\n***********************\nStarting supergraph using PM2...\n***********************\n\n`,
  );
  try {
    // start pm2 daemon to avoid race conditions
    await execa('pm2', ['ping']);

    const pm2Logs = execa('pm2', ['logs']);
    pm2Logs.stdout.pipe(writeableDebugStream(pm2Debug));
    pm2Logs.stderr.pipe(writeableDebugStream(pm2Debug));

    let productsSubgraph = null;
    if (config.configFile) {
      productsSubgraph = await startProductsSubgraphUsingPm2(config.configFile);
    }

    const template = await readFile(
      resolve(__dirname, '..', 'supergraph-config.js.template'),
      'utf-8',
    );
    const supergraphConfig = template.replaceAll(
      '${DIST_DIR}',
      resolve(__dirname),
    );
    await writeFile('supergraph.config.js', supergraphConfig);

    const proc = execa('pm2', ['start', 'supergraph.config.js']);
    proc.stdout.pipe(writeableDebugStream(pm2Debug));
    proc.stderr.pipe(writeableDebugStream(pm2Debug));

    if (productsSubgraph != null && productsSubgraph.exitCode !== 0) {
      throw new Error('Products subgraph did not start successfully');
    }

    await proc;
    if (proc.exitCode !== 0) {
      throw new Error('Subgraphs did not start successfully');
    }

    const started = await composeDevSupergraph(
      config.endpoint,
      config.schemaFile,
    );
    pm2Logs.cancel();

    if (started) {
      return async () => {
        pm2Debug(
          `\n***********************\nStopping supergraph...\n***********************\n\n`,
        );
        await shutdownSupergraphUsingPm2();
      };
    } else {
      throw new Error('Supergraph did not start successfully');
    }
  } catch (err) {
    await shutdownSupergraphUsingPm2();
    throw err;
  }
}

/**
 * Flushes PM2 logs and then stops all PM2 processes (including daemon).
 */
async function shutdownSupergraphUsingPm2() {
  const logsFlushed = await execa('pm2', ['flush']);
  const stopped = await execa('pm2', ['kill']);
  if (logsFlushed.exitCode !== 0 || stopped.exitCode !== 0) {
    console.error('PM2 did not shutdown correctly');
  }
}

async function startProductsSubgraphUsingPm2(configFile: string) {
  // start products subgraph
  pm2Debug(`Starting products subgraph...`);
  const productsSubgraph = execa('pm2', ['start', configFile]);

  productsSubgraph.stdout.pipe(writeableDebugStream(pm2Debug));
  productsSubgraph.stderr.pipe(writeableDebugStream(pm2Debug));
  return productsSubgraph;
}

async function startSupergraphUsingDocker(config: DockerConfig) {
  await composeSupergraph(
    config.schemaFile,
    config.path ?? '',
    config.port ?? '4001',
  );
  dockerDebug(
    `\n***********************\nStarting supergraph using Docker Compose...\n***********************\n\n`,
  );

  const template = await readFile(
    resolve(__dirname, '..', 'supergraph-compose.yaml.template'),
    'utf-8',
  );
  const supergraphConfig = template
    .replaceAll('${SCRIPT_DIR}', resolve(__dirname, '..'))
    .replaceAll('${DIST_DIR}', resolve(__dirname));

  await writeFile('supergraph-compose.yaml', supergraphConfig);

  try {
    const proc = execa('docker', [
      'compose',
      '-f',
      'supergraph-compose.yaml',
      '-f',
      config.composeFile,
      'up',
      '--build',
      '--detach',
    ]);

    proc.stdout.pipe(writeableDebugStream(dockerDebug));
    proc.stderr.pipe(writeableDebugStream(dockerDebug));

    await proc;
    if (proc.exitCode !== 0) {
      throw new Error('docker-compose did not start successfully');
    }

    const started = await healtcheckSupergraph(
      `http://localhost:${config.port ?? '4001'}${config.path ?? ''}`,
    );
    if (started) {
      return async () => {
        dockerDebug(
          `\n***********************\nStopping supergraph...\n***********************\n\n`,
        );
        await shutdownSupergraphUsingDocker(config.composeFile);
      };
    } else {
      throw new Error('Supergraph did not start successfully');
    }
  } catch (err) {
    await shutdownSupergraphUsingDocker(config.composeFile);
    throw err;
  }
}

async function shutdownSupergraphUsingDocker(composeFile: string) {
  const logs = execa('docker', [
    'compose',
    '-f',
    'supergraph-compose.yaml',
    '-f',
    composeFile,
    'logs',
  ]);
  logs.stdout.pipe(writeableDebugStream(dockerDebug));
  logs.stderr.pipe(writeableDebugStream(dockerDebug));

  const logsCompleted = await logs;
  const shutdown = await execa('docker', [
    'compose',
    '-f',
    'supergraph-compose.yaml',
    '-f',
    composeFile,
    'down',
    '--remove-orphans',
    '-v',
  ]);
  if (logsCompleted.exitCode !== 0 || shutdown.exitCode !== 0) {
    console.error('Docker compose did not shutdown correctly');
  }
}
