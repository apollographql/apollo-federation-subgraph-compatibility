#!/usr/bin/env node

import debug from 'debug';
import { Command, Option, OptionValues } from 'commander';
import {
  compatibilityTest,
  DockerConfig,
  Pm2Config,
} from '@apollo/federation-subgraph-compatibility-tests';

enum TestRuntime {
  DOCKER,
  PM2,
}

function generateRuntimeConfig(
  runtime: TestRuntime,
  options: OptionValues,
): DockerConfig | Pm2Config {
  let runtimeConfig: DockerConfig | Pm2Config;
  if (runtime === TestRuntime.DOCKER) {
    runtimeConfig = {
      kind: 'docker',
      schemaFile: options.schema,
      composeFile: options.compose,
      path: options.path,
      port: options.port,
      format: options.format,
      failOnRequired: options.failOnRequired,
      failOnWarning: options.failOnWarning,
    };
  } else {
    runtimeConfig = {
      kind: 'pm2',
      endpoint: options.endpoint,
      schemaFile: options.schema,
      configFile: options.config,
      format: options.format,
      failOnRequired: options.failOnRequired,
      failOnWarning: options.failOnWarning,
    };
  }
  return runtimeConfig;
}

class CompatibilityTestCommand extends Command {
  createCommand(name: string): Command {
    return new CompatibilityTestCommand(name)
      .addOption(
        new Option('--format <json|markdown>', 'optional output file format')
          .choices(['json', 'markdown'])
          .default('markdown'),
      )
      .option('--debug', 'debug mode with extra log info')
      .option(
        '--failOnRequired',
        'boolean flag to indicate whether any failing required test should fail the script.',
      )
      .option(
        '--failOnWarning',
        'boolean flag to indicate whether any failing test should fail the script.',
      )
      .showHelpAfterError()
      .configureHelp({ sortOptions: true });
  }
}

const program = new CompatibilityTestCommand();

program
  .description('Run Apollo Federation subgraph compatibility tests')
  .version(require('../package.json').version)
  .showHelpAfterError();

program
  .command('pm2')
  .description('Start supergraph using PM2')
  .requiredOption('--endpoint <url>', 'subgraph endpoint')
  .option(
    '--schema <schema.graphql>',
    'optional path to schema file, if omitted composition will fallback to introspection',
  )
  .option('--config <subgraph.config.js>', 'optional PM2 configuration file')
  .action((options) => {
    if (options.debug) {
      console.log('setting debug setting');
      debug.enable('debug,pm2,docker,rover,test');
    }
    let runtimeConfig = generateRuntimeConfig(TestRuntime.PM2, options);
    compatibilityTest(runtimeConfig).then((successful) => {
      if (!successful) {
        process.exitCode = 1;
      }
    });
  })
  .configureHelp({ sortOptions: true });

program
  .command('docker')
  .description('Start supergraph using Docker Compose')
  .requiredOption(
    '--compose <docker-compose.yaml>',
    'Path to docker compose file',
  )
  .requiredOption('--schema <schema.graphql>', 'Path to schema file')
  .option('--path <path>', 'GraphQL endpoint path', '')
  .option('--port <port>', 'HTTP server port', '4001')
  .action((options) => {
    if (options.debug) {
      console.log('setting debug setting');
      debug.enable('debug,pm2,docker,rover,test');
    }
    let runtimeConfig = generateRuntimeConfig(TestRuntime.DOCKER, options);
    compatibilityTest(runtimeConfig).then((successful) => {
      if (!successful) {
        process.exitCode = 1;
      }
    });
  })
  .configureHelp({ sortOptions: true });

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
});
