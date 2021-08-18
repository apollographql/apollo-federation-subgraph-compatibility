import { readdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { ping } from "./utils/client";
import { generateMarkdown } from "./utils/markdown";
import execa from "execa";
import debug from "debug";
import { Writable } from "stream";

const dockerDebug = debug("docker");
const dockerDebugStream = () =>
  new Writable({
    write(chunk, encoding, next) {
      dockerDebug(chunk.toString());
      next();
    },
  });
const jestDebug = debug("test");
const jestDebugStream = () =>
  new Writable({
    write(chunk, encoding, next) {
      jestDebug(chunk.toString());
      next();
    },
  });

function getFolderNamesFromPath(path: string) {
  return readdirSync(path, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

class KeySupport {
  singleField: boolean = false;
  multipleFields: boolean = false;
  composite: boolean = false;
}

export class TestResult {
  startedSuccessfully: boolean = false;
  serviceSdl: boolean = false;
  keySupport: KeySupport = new KeySupport();
  requiresSupport: boolean = false;
  providesSupport: boolean = false;
  ftv1Support: boolean = false;
}
let results = new Map<string, TestResult>();

async function runDockerCompose(libraryName: string, librariesPath: string) {
  console.log("Starting containers...");
  const proc = execa("docker-compose", [
    "-f",
    "docker-compose.yaml",
    "-f",
    `${librariesPath}/${libraryName}/docker-compose.yaml`,
    "up",
    "--build",
    "--detach",
  ]);

  proc.stdout.pipe(dockerDebugStream());
  proc.stderr.pipe(dockerDebugStream());

  await proc;

  if (proc.exitCode === 0) {
    results.get(libraryName).startedSuccessfully = true;
  } else {
    throw new Error("docker-compose did not start successfully");
  }

  return async () => {
    console.log("Stopping containers...");
    await execa("docker-compose", ["down", "--remove-orphans"]);
  };
}

async function runJest(libraryName: string): Promise<JestJSONOutput> {
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

  return results;
}

interface JestJSONOutput {
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
    assertionResults: {
      failureMessages: string[];
      fullName: string;
      status: "failed" | "passed";
      title: string;
    }[];
  }[];
}

(async () => {
  // npm install will also setup project by building docker images along with supergraph sdl
  const libraries =
    process.argv.length > 2 ? (process.argv[2] as string) : undefined;

  const librariesPath = resolve(__dirname, "..", "implementations");
  const implementationFolders = getFolderNamesFromPath(librariesPath);
  const libraryNames = libraries ? libraries.split(",") : implementationFolders;

  for (const libraryName of libraryNames) {
    if (libraryName == "_template_") continue;
    if (!implementationFolders.includes(libraryName)) {
      console.log(
        `Library ${libraryName} was not found in the implementations folder`
      );
      continue;
    }

    results.set(libraryName, new TestResult());

    const dockerComposeDown = await runDockerCompose(
      libraryName,
      librariesPath
    );

    try {
      const startupSuccess = await ping();

      if (startupSuccess) {
        console.log(`Library ${libraryName} started successfully`);

        const libraryResults = results.get(libraryName);
        libraryResults.startedSuccessfully = true;

        const jestOutput = await runJest(libraryName);
        const assertions = jestOutput.testResults.flatMap(
          (x) => x.assertionResults
        );

        const assertionPassed = (name: string) =>
          assertions.find((a) => a.fullName === name)?.status === "passed";

        libraryResults.serviceSdl = assertionPassed("introspection");
        libraryResults.keySupport.singleField = assertionPassed("@key single");
        libraryResults.keySupport.multipleFields =
          assertionPassed("@key multiple");
        libraryResults.keySupport.composite = assertionPassed("@key composite");
        libraryResults.requiresSupport = assertionPassed("@requires");
        libraryResults.providesSupport = assertionPassed("@provides");
        libraryResults.ftv1Support = assertionPassed("ftv1");

        console.log(`Library ${libraryName} complete!`);
      } else {
        results.get(libraryName).startedSuccessfully = false;
        console.log(`Library ${libraryName} was not started successfully`);
      }
    } catch (err) {
      console.log(`Library ${libraryName} encountered an error: ${err}`);
    } finally {
      await dockerComposeDown();
    }
  }

  generateMarkdown(results);

  console.log("complete");
  process.exit();
})().catch(console.error);
