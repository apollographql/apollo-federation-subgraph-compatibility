import execa from 'execa';
import debug from 'debug';
import { healthcheckRouter, healthcheck } from './utils/client';
import { logWithTimestamp, writeableDebugStream } from './utils/logging';
import { normalizePath } from './utils/path';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';

const COMPOSITION_VERSION =
  process.env['APOLLO_ROVER_DEV_COMPOSITION_VERSION'] ?? '2.3.2';
const roverDebug = debug('rover');

/**
 * Composes supergraph using rover dev command and introspection.
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

  // composing supergraph
  //   cannot use supergraph.config.js as we need to run rover dev sequentially for each subgraph
  //   this is a workaround to https://github.com/apollographql/rover/issues/1258
  // TODO cleanup once multiple subgraphs could be specified with single rover dev command
  await composeDevSubgraph('products', productsUrl, productsSchema);
  await composeDevSubgraph(
    'users',
    'http://localhost:4002',
    resolve(__dirname, 'subgraphs', 'users', 'users.graphql'),
  );
  await composeDevSubgraph(
    'inventory',
    'http://localhost:4003',
    resolve(__dirname, 'subgraphs', 'inventory', 'inventory.graphql'),
  );

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

async function composeDevSubgraph(
  subgraphName: string,
  subgraphUrl: string,
  schemaFile?: string,
) {
  roverDebug(`Composing supergraph - loading ${subgraphName} schema`);

  const started = await healthcheck(subgraphName, subgraphUrl);
  if (started) {
    const params = [
      'start',
      'rover',
      '--name',
      `rover-${subgraphName}`,
      '--',
      'dev',
      '--name',
      subgraphName,
      '--url',
      subgraphUrl,
      '--supergraph-port',
      '4000',
    ];

    if (schemaFile) {
      params.push('--schema', schemaFile);
    }

    const proc = execa('pm2', params, {
      env: { APOLLO_ROVER_DEV_COMPOSITION_VERSION: `v${COMPOSITION_VERSION}` },
    });
    proc.stdout.pipe(writeableDebugStream(roverDebug));
    proc.stderr.pipe(writeableDebugStream(roverDebug));

    await proc;

    if (proc.exitCode !== 0) {
      throw new Error(
        `Failed to compose supergraph - failed to load ${subgraphName} schema`,
      );
    }
  } else {
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
