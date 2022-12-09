import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { TestResultDetails } from './testRunner';
import { generateMarkdown } from './utils/markdown';

async function generateReports(resultsFile: string) {
  const results = await readFile(resultsFile, 'utf-8');
  let testResults: TestResultDetails[] = JSON.parse(results);

  generateMarkdown(testResults);
}

const program = new Command();

program
  .description('Generate Apollo Federation Compatibility report.')
  .argument('<result.json>', 'compatibility results in JSON format')
  .action((resultsFile) => {
    generateReports(resultsFile);
  })
  .showHelpAfterError();

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
});
