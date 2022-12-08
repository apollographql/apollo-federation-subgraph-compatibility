#!/usr/bin/env node

import debug from 'debug';
import { Command, Option, OptionValues } from 'commander';
import { DockerConfig, Pm2Config, startSupergraph } from './startSupergraph';
import { runJest, TestResults, TESTS } from './testRunner';
import { writeFile } from 'fs/promises';
import { generateSimplifiedMarkdown } from './utils/markdown';
import { logResults, logWithTimestamp } from './utils/logging';

enum TestRuntime {
  DOCKER,
  PM2,
}

async function compatibilityTests(runtime: TestRuntime, options: OptionValues) {
  logWithTimestamp('******************************************************');
  logWithTimestamp('Starting Apollo Federation Subgraph Compatibility Test');
  logWithTimestamp('******************************************************');

  const testResults: TestResults = {};

  let runtimeConfig: DockerConfig | Pm2Config;
  if (runtime === TestRuntime.DOCKER) {
    runtimeConfig = {
      kind: 'docker',
      schemaFile: options.schema,
      composeFile: options.compose,
      path: options.path,
      port: options.port,
    };
  } else {
    runtimeConfig = {
      kind: 'pm2',
      endpoint: options.endpoint,
      schemaFile: options.schema,
      configFile: options.config,
    };
  }

  // start supergraph
  const stopSupergraph = await startSupergraph(runtimeConfig);
  try {
    // run tests
    const { assertionPassed } = await runJest('compatibility');
    for (const { assertion } of TESTS) {
      testResults[assertion] = { success: assertionPassed(assertion) };
    }

    logWithTimestamp('compatibility tests complete...');
  } catch (err) {
    logWithTimestamp(`compatibility tests encountered an error: ${err}`);
  } finally {
    await stopSupergraph();
  }

  logWithTimestamp('generating results...');

  if (options.format == 'markdown') {
    generateSimplifiedMarkdown(testResults, `results.md`);
  } else {
    await writeFile(
      `results.json`,
      JSON.stringify(testResults, null, 2),
      'utf-8',
    );
  }

  logWithTimestamp('compatibility test complete');
  // print results to console
  logResults(testResults);
  process.exit(0);
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
      .showHelpAfterError()
      .configureHelp({ sortOptions: true });
  }
}

const program = new CompatibilityTestCommand();

program
  .description(`Run Apollo Federation subgraph compatibility tests`)
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
    compatibilityTests(TestRuntime.PM2, options);
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
    compatibilityTests(TestRuntime.DOCKER, options);
  })
  .configureHelp({ sortOptions: true });

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
});
