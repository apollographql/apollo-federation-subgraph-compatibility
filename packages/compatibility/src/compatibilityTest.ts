import { DockerConfig, Pm2Config, startSupergraph } from './startSupergraph';
import { runJest, TestResults, TESTS } from './testRunner';
import { writeFile } from 'fs/promises';
import { generateSimplifiedMarkdown } from './utils/markdown';
import { logResults, logWithTimestamp } from './utils/logging';

export async function compatibilityTest(
  runtimeConfig: DockerConfig | Pm2Config,
) {
  logWithTimestamp('******************************************************');
  logWithTimestamp('Starting Apollo Federation Subgraph Compatibility Test');
  logWithTimestamp('******************************************************');

  const testResults: TestResults = {};

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
  process.exit(0);
}
