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
    // run tests
    const { assertionPassed } = await runJest();
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

  if (runtimeConfig.failOnRequired) {
    return allRequiredSuccessful;
  } else if (runtimeConfig.failOnWarning) {
    return allSuccessful;
  } else {
    return true;
  }
}
