import { writeFileSync } from 'fs';
import execa from 'execa';
import debug from 'debug';
import { resolve } from 'path';
import { writeableDebugStream } from './utils/logging';

const jestDebug = debug('test');

export const TESTS = [
  {
    assertion: 'service field',
    column: 'service field',
    fedVersion: 2,
    required: false,
  },
  {
    assertion: 'introspection',
    column: '_service',
    fedVersion: 1,
    required: true,
  },
  {
    assertion: '@key single',
    column: '@key (single)',
    fedVersion: 1,
    required: true,
  },
  {
    assertion: '@key multiple',
    column: '@key (multi)',
    fedVersion: 1,
    required: false,
  },
  {
    assertion: '@key composite',
    column: '@key (composite)',
    fedVersion: 1,
    required: false,
  },
  {
    assertion: 'repeatable @key',
    column: 'repeatable @key',
    fedVersion: 1,
    required: false,
  },
  {
    assertion: '@requires',
    column: '@requires',
    fedVersion: 1,
    required: false,
  },
  {
    assertion: '@provides',
    column: '@provides',
    fedVersion: 1,
    required: false,
  },
  {
    assertion: 'ftv1',
    column: 'federated tracing',
    fedVersion: 1,
    required: false,
  },
  { assertion: '@link', column: '@link', fedVersion: 2, required: true },
  {
    assertion: '@shareable',
    column: '@shareable',
    fedVersion: 2,
    required: false,
  },
  { assertion: '@tag', column: '@tag', fedVersion: 2, required: false },
  {
    assertion: '@override',
    column: '@override',
    fedVersion: 2,
    required: false,
  },
  {
    assertion: '@inaccessible',
    column: '@inaccessible',
    fedVersion: 2,
    required: false,
  },
];

export async function runJest(libraryName: string): Promise<JestResults> {
  console.log(new Date().toJSON(), 'starting tests...');
  jestDebug(
    `\n***********************\nStarting tests...\n***********************\n\n`,
  );

  const jestBin = require.resolve('jest/bin/jest');
  const proc = execa(
    jestBin,
    [
      `${__dirname}/tests`,
      '--ci',
      '--json',
      '--config',
      resolve(__dirname, '..', 'jest.config.js'),
    ],
    { reject: false },
  );

  proc.stdout.pipe(writeableDebugStream(jestDebug));
  proc.stderr.pipe(writeableDebugStream(jestDebug));

  const { stdout, stderr } = await proc;

  if (proc.exitCode > 1) {
    throw new Error('jest failed to run');
  }

  const results = JSON.parse(stdout) as JestJSONOutput;

  const assertions = results.testResults.flatMap((x) => x.assertionResults);
  const assertionPassed = (name: string) => {
    return !assertions.some((a: any) => {
      const assertionName =
        a.ancestorTitles.length === 0 ? a.fullName : a.ancestorTitles[0];
      return assertionName === name && a.status === 'failed';
    });
  };

  return {
    rawResults: results,
    assertions,
    assertionPassed,
  };
}

export interface TestResultDetails {
  name: string;
  fullName?: string;
  version?: string;
  language?: string;
  documentation?: string;
  dependencies?: {
    name: string;
    url: string;
    version: string;
  }[];
  started: boolean;
  tests: TestResults;
}

export interface TestResults {
  [name: string]: {
    success: boolean;
    caveat?: string;
  };
}

export interface JestAssertionResult {
  failureMessages: string[];
  fullName: string;
  status: 'failed' | 'passed';
  title: string;
}

export interface JestJSONOutput {
  numFailedTestSuites: number;
  numFailedTests: number;
  numPassedTestSuites: number;
  numPassedTests: number;
  numPendingTestSuites: number;
  numPendingTests: number;
  numRuntimeErrorTestSuites: number;
  numTodoTests: number;
  numTotalTestSuites: number;
  numTotalTests: number;
  success: boolean;
  testResults: {
    name: string;
    status: 'failed' | 'passed';
    summary: string;
    message: string;
    assertionResults: JestAssertionResult[];
  }[];
}

export interface JestResults {
  rawResults: JestJSONOutput;
  assertions: JestAssertionResult[];
  assertionPassed: (name: string) => boolean;
}
