import { writeFileSync } from "fs";
import execa from "execa";
import debug from "debug";
import { Writable } from "stream";

const jestDebug = debug("test");
const jestDebugStream = () =>
  new Writable({
    write(chunk, encoding, next) {
      jestDebug(chunk.toString());
      next();
    },
  });

export const TESTS = [
  { assertion: "introspection", column: "_service", fedVersion: 1, required: true },
  { assertion: "@key single", column: "@key (single)", fedVersion: 1, required: true },
  { assertion: "@key multiple", column: "@key (multi)", fedVersion: 1, required: false },
  { assertion: "@key composite", column: "@key (composite)", fedVersion: 1, required: false },
  { assertion: "@requires", column: "@requires", fedVersion: 1, required: false },
  { assertion: "@provides", column: "@provides", fedVersion: 1, required: false },
  { assertion: "ftv1", column: "@ftv1", fedVersion: 1, required: false },
  { assertion: "@link", column: "@link", fedVersion: 2, required: true },
  { assertion: "@shareable", column: "@shareable", fedVersion: 2, required: false },
  { assertion: "@tag", column: "@tag", fedVersion: 2, required: false },
  { assertion: "@override", column: "@override", fedVersion: 2, required: false },
  { assertion: "@inaccessible", column: "@inaccessible", fedVersion: 2, required: false },
];

export async function runJest(libraryName: string): Promise<JestResults> {
  const jestBin = require.resolve("jest/bin/jest");
  const proc = execa(jestBin, ["src", "--ci", "--json"], { reject: false });

  proc.stdout.pipe(jestDebugStream());
  proc.stderr.pipe(jestDebugStream());

  const { stdout, stderr } = await proc;

  if (proc.exitCode > 1) {
    throw new Error("jest failed to run");
  }

  const results = JSON.parse(stdout) as JestJSONOutput;

  if (results.numFailedTests > 0) {
    writeFileSync(`tmp/${libraryName}-testfailures.txt`, stderr, "utf-8");
  }

  const assertions = results.testResults.flatMap((x) => x.assertionResults);
  const assertionPassed = (name: string) => {
    return (
      !assertions.some((a: any) => {
        const assertionName =
          a.ancestorTitles.length === 0 ? a.fullName : a.ancestorTitles[0];
        return assertionName === name && a.status === "failed";
      })
    );
  };

  return {
    rawResults: results,
    assertions,
    assertionPassed,
  };
}

export interface TestResult {
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
  tests: {
    [name: string]: {
      success: boolean;
      caveat?: string;
    };
  };
}

export interface JestAssertionResult {
  failureMessages: string[];
  fullName: string;
  status: "failed" | "passed";
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
    status: "failed" | "passed";
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
