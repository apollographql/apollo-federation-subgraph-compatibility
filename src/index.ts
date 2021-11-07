import { readdirSync } from "fs";
import { resolve } from "path";
import { ping } from "./utils/client";
import { generateMarkdown } from "./utils/markdown";
import execa from "execa";
import debug from "debug";
import { Writable } from "stream";
import { runJest, TestResult, TESTS } from "./testRunner";

const dockerDebug = debug("docker");
const dockerDebugStream = () =>
  new Writable({
    write(chunk, encoding, next) {
      dockerDebug(chunk.toString());
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

async function runDockerComposeUp(libraryName: string, librariesPath: string) {
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

  if (proc.exitCode !== 0) {
    throw new Error("docker-compose did not start successfully");
  }
}

async function runDockerComposeDown() {
  console.log("Stopping containers...");
  await execa("docker-compose", ["down", "--remove-orphans"]);
}

(async () => {
  // npm install will also setup project by building docker images along with supergraph sdl
  const libraries =
    process.argv.length > 2 ? (process.argv[2] as string) : undefined;

  const librariesPath = resolve(__dirname, "..", "implementations");
  const implementationFolders = getFolderNamesFromPath(librariesPath);
  const libraryNames = libraries ? libraries.split(",") : implementationFolders;

  let exitCode = 0;
  const results = new Map<string, TestResult>();

  for (const libraryName of libraryNames) {
    if (libraryName == "_template_") continue;
    if (!implementationFolders.includes(libraryName)) {
      console.log(
        `Library ${libraryName} was not found in the implementations folder`
      );
      continue;
    }

    const result: TestResult = { name: libraryName, started: false, tests: {} };
    results.set(libraryName, result);

    try {
      await runDockerComposeUp(
        libraryName,
        librariesPath
      );

      const startupSuccess = await ping();

      if (startupSuccess) {
        console.log(`Library ${libraryName} started successfully`);

        result.started = true;

        const { assertionPassed } = await runJest(libraryName);

        for (const { assertion } of TESTS) {
          result.tests[assertion] = { success: assertionPassed(assertion) };
        }

        console.log(`Library ${libraryName} complete!`);
      } else {
        result.started = false;
        console.log(`Library ${libraryName} was not started successfully`);
        exitCode = 1;
      }
    } catch (err) {
      console.log(`Library ${libraryName} encountered an error: ${err}`);
      exitCode = 1;
    } finally {
      await runDockerComposeDown();
    }
  }

  generateMarkdown(results);

  console.log("complete");

  process.exit(exitCode);
})().catch(console.error);
