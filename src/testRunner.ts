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
  { assertion: "introspection", column: "_service" },
  { assertion: "@key single", column: "@key (single)" },
  { assertion: "@key multiple", column: "@key (multi)" },
  { assertion: "@key composite", column: "@key (composite)" },
  { assertion: "@requires", column: "@requires" },
  { assertion: "@provides", column: "@provides" },
  { assertion: "ftv1", column: "@ftv1" },
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
  const assertionPassed = (name: string) =>
    assertions.find((a) => a.fullName === name)?.status === "passed";

  return {
    rawResults: results,
    assertions,
    assertionPassed,
  };
}

export interface TestResult {
  name: string;
  started: boolean;
  tests: {
    [name: string]: {
      success: boolean;
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
