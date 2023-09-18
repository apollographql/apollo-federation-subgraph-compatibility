import { DockerConfig, Pm2Config, startSupergraph } from './startSupergraph';
import { runJest, TestResults, TESTS } from './testRunner';
import { writeFile } from 'fs/promises';
import { generateSimplifiedMarkdown } from './utils/markdown';
import { logResults, logWithTimestamp } from './utils/logging';

export async function compatibilityTest(
  runtimeConfig: DockerConfig | Pm2Config,
): Promise<boolean> {
  logWithTimestamp('******************************************************');
  logWithTimestamp('Starting Apollo Federation Subgraph Compatibility Test');
  logWithTimestamp('******************************************************');

  const testResults: TestResults = {};
  let allRequiredSuccessful = true;
  let allSuccessful = true;

  // start supergraph
  const stopSupergraph = await startSupergraph(runtimeConfig);
  try {
    const productUrl = calculateProductSubgraphUrl(runtimeConfig);
    // run tests
    const { assertionPassed } = await runJest(productUrl);
    for (const { assertion, required } of TESTS) {
      const testSuccessful = assertionPassed(assertion);
      testResults[assertion] = { success: testSuccessful };

      if (!testSuccessful) {
        if (required) {
          allRequiredSuccessful = false;
          allSuccessful = false;
        } else {
          allSuccessful = false;
        }
      }
    }

    logWithTimestamp('compatibility tests complete...');
  } catch (err) {
    logWithTimestamp(`compatibility tests encountered an error: ${err}`);
  } finally {
    await stopSupergraph();
  }

  logWithTimestamp('generating results...');

  if (runtimeConfig.format == 'markdown') {
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

  if (runtimeConfig.failOnWarning) {
    return allSuccessful;
  } else if (runtimeConfig.failOnRequired) {
    return allRequiredSuccessful;
  } else {
    return true;
  }
}

function calculateProductSubgraphUrl(config: DockerConfig | Pm2Config): string {
  if (config.kind === 'pm2') {
    return config.endpoint;
  } else {
    const graphQLPath = config.path ?? '';
    const graphqlPort = config.port ?? '4001';
    return `http://localhost:${graphqlPort}${graphQLPath}`;
  }
}
