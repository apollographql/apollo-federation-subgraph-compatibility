import debug from 'debug';
import artifact from '@actions/artifact';
import { getBooleanInput, getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import {
  compatibilityTest,
  DockerConfig,
} from '@apollo/federation-subgraph-compatibility-tests';
import { readFileSync } from 'fs';

async function main(): Promise<void> {
  const debugMode: boolean = getBooleanInput('debug');
  if (debugMode) {
    console.log('setting debug setting');
    debug.enable('debug,pm2,docker,rover,test');
  }

  const runtimeConfig: DockerConfig = {
    kind: 'docker',
    schemaFile: getInput('schema'),
    composeFile: getInput('compose'),
    path: getInput('path') ?? '',
    port: getInput('port') ?? '4001',
    format: 'markdown',
  };
  compatibilityTest(runtimeConfig);

  // upload artifact
  const artifactClient = artifact.create();
  const artifactName = 'compatibility-results';
  const files = ['results.md'];
  const rootDirectory = __dirname;
  const options = {
    continueOnError: false,
  };
  await artifactClient.uploadArtifact(
    artifactName,
    files,
    rootDirectory,
    options,
  );

  // comment on PR
  const { pull_request } = context.payload;
  if (pull_request) {
    const token: string = getInput('token');
    if (token) {
      const octokit = getOctokit(token);
      const bodyContents: string = readFileSync('results.md', 'utf-8');
      await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: bodyContents,
      });
    } else {
      console.warn('Github Token not provided');
    }
  }
}

main().catch((error) => {
  console.error(error);
});
