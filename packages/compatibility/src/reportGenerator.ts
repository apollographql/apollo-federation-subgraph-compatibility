import { readFile } from 'fs/promises';
import { TestResultDetails } from './testRunner';
import { generateMarkdown } from './utils/markdown';

export async function generateReport(resultsFile: string) {
  const results = await readFile(resultsFile, 'utf-8');
  let testResults: TestResultDetails[] = JSON.parse(results);

  generateMarkdown(testResults);
}
