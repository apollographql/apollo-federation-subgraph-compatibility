import execa from 'execa';
import debug from 'debug';
import { healthcheckRouter, healthcheck } from './utils/client';
import { logWithTimestamp, writeableDebugStream } from './utils/logging';
import { normalizePath } from './utils/path';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';

const COMPOSITION_VERSION =
  process.env['APOLLO_ROVER_DEV_COMPOSITION_VERSION'] ?? '2.15.1';
const ROUTER_VERSION =
  process.env['APOLLO_ROVER_DEV_ROUTER_VERSION'] ?? '2.16.1';
const roverDebug = debug('rover');

const USERS_URL = 'http://localhost:4002';
const INVENTORY_URL = 'http://localhost:4003';

/**
 * Composes supergraph using rover dev command and introspection.
 *
 * As of rover v0.27.0, `rover dev` no longer supports joining multiple
 * independent `rover dev` processes into a single session (see
 * https://github.com/apollographql/rover/releases/tag/v0.27.0). A single
 * `rover dev --supergraph-config` process listing all subgraphs must be used
 * instead.
 *
 * @param productsUrl products schema URL
 */
export async function composeDevSupergraph(
  productsUrl: string,
  productsSchema?: string,
): Promise<Boolean> {
  logWithTimestamp('composing supergraph...');
  roverDebug(
    `\n***********************\nComposing supergraph...\n***********************\n\n`,
  );

  await Promise.all([
    healthcheckOrThrow('products', productsUrl),
    healthcheckOrThrow('users', USERS_URL),
    healthcheckOrThrow('inventory', INVENTORY_URL),
  ]);

  const template = await readFile(
    resolve(__dirname, '../supergraph-dev-config.yaml.template'),
    'utf-8',
  );
  const productsSchemaConfig = productsSchema
    ? `file: ${productsSchema}`
    : `subgraph_url: ${productsUrl}`;
  const supergraphConfig = template
    .replace('${COMPOSITION_VERSION}', COMPOSITION_VERSION)
    .replaceAll('${DIST_DIR}', normalizePath(resolve(__dirname)))
    .replace('${PRODUCTS_URL}', productsUrl)
    .replace('${PRODUCTS_SCHEMA}', productsSchemaConfig);

  const supergraphConfigPath = resolve('supergraph-dev-config.yaml');
  await writeFile(supergraphConfigPath, supergraphConfig);

  const routerConfigPath = resolve(__dirname, '../router.yaml');
  const params = [
    'start',
    'rover',
    '--name',
    'rover-dev',
    '--',
    'dev',
    '--supergraph-config',
    supergraphConfigPath,
    '--router-config',
    routerConfigPath,
  ];

  const proc = execa('pm2', params, {
    env: {
      APOLLO_ROVER_DEV_COMPOSITION_VERSION: COMPOSITION_VERSION,
      APOLLO_ROVER_DEV_ROUTER_VERSION: ROUTER_VERSION,
    },
  });
  proc.stdout.pipe(writeableDebugStream(roverDebug));
  proc.stderr.pipe(writeableDebugStream(roverDebug));

  await proc;

  if (proc.exitCode !== 0) {
    throw new Error('Failed to compose supergraph');
  }

  const started = await healthcheckRouter();
  if (started) {
    roverDebug(
      `\n***********************\nSupergraph composed...\n***********************\n\n`,
    );
    return true;
  } else {
    return false;
  }
}

async function healthcheckOrThrow(subgraphName: string, subgraphUrl: string) {
  const started = await healthcheck(subgraphName, subgraphUrl);
  if (!started) {
    throw new Error(`${subgraphName} failed to start`);
  }
}

export async function composeSupergraph(
  schemaFile: string,
  graphQLEndpoint: string = '',
  port: string = '4001',
) {
  logWithTimestamp('composing supergraph...');
  roverDebug(
    `\n***********************\nComposing supergraph...\n***********************\n\n`,
  );

  // generate supergraph config
  const template = await readFile(
    resolve(__dirname, '../supergraph-config.yaml.template'),
    'utf-8',
  );
  const supergraphConfig = template
    .replace('${COMPOSITION_VERSION}', COMPOSITION_VERSION)
    .replaceAll('${DIST_DIR}', normalizePath(resolve(__dirname)))
    .replace('${PORT}', port)
    .replace('${GRAPHQL_PATH}', graphQLEndpoint)
    .replace('${SCHEMA_FILE}', schemaFile);

  await writeFile('supergraph-config.yaml', supergraphConfig);

  // compose supergraph
  const composeProcess = execa(
    'npx',
    [
      '@apollo/rover',
      'supergraph',
      'compose',
      '--config',
      'supergraph-config.yaml',
    ],
    {
      env: {
        APOLLO_ELV2_LICENSE: 'accept',
      },
    },
  );
  composeProcess.stdout.pipe(createWriteStream('supergraph.graphql'));
  composeProcess.stderr.pipe(writeableDebugStream(roverDebug));
  await composeProcess;

  if (composeProcess.exitCode !== 0) {
    throw new Error(`Failed to compose supergraph`);
  }
  roverDebug(
    `\n***********************\nSupergraph composed...\n***********************\n\n`,
  );
}
