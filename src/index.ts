import { readdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import execa from "execa";
import debug from "debug";
import { load } from "js-yaml";
import { defaultsDeep } from "lodash";
import { healtcheckAll } from "./utils/client";
import { generateMarkdown } from "./utils/markdown";
import { runJest, TestResultDetails, TESTS } from "./testRunner";
import { writeableDebugStream } from "./utils/logging";

const dockerDebug = debug("docker");

function getFolderNamesFromPath(path: string) {
  return readdirSync(path, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function runDockerCompose(libraryName: string, librariesPath: string) {
  console.log(`Starting containers for testing ${libraryName} implementation...`);
  const proc = execa("docker", [
    "compose",
    "-f",
    "docker-compose.yaml",
    "-f",
    `${librariesPath}/${libraryName}/docker-compose.yaml`,
    "up",
    "--build",
    "--detach",
  ]);

  proc.stdout.pipe(writeableDebugStream(dockerDebug));
  proc.stderr.pipe(writeableDebugStream(dockerDebug));

  await proc;

  if (proc.exitCode !== 0) {
    throw new Error("docker-compose did not start successfully");
  }

  return async () => {
    console.log(`Stopping ${libraryName} and related containers...`);
    await execa("docker-compose", ["down", "--remove-orphans", "-v"]);
  };
}

async function main() {
  // npm install will also setup project by building docker images along with supergraph sdl
  const libraries =
    process.argv.length > 2 ? (process.argv[2] as string) : undefined;

  const librariesPath = resolve(__dirname, "..", "implementations");
  const implementationFolders = getFolderNamesFromPath(librariesPath);
  const libraryNames = libraries ? libraries.split(",") : implementationFolders;
  const results: TestResultDetails[] = [];

  for (const libraryName of libraryNames) {
    if (libraryName === "_template_hosted_" || libraryName === "_template_library_") continue;
    if (!implementationFolders.includes(libraryName)) {
      console.log(
        `Library ${libraryName} was not found in the implementations folder`
      );
      continue;
    }

    const result: TestResultDetails = { name: libraryName, started: false, tests: {} };
    results.push(result);

    const dockerComposeDown = await runDockerCompose(
      libraryName,
      librariesPath
    );

    try {
      const startupSuccess = await healtcheckAll(libraryName);

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
      }
    } catch (err) {
      console.log(`Library ${libraryName} encountered an error: ${err}`);
    } finally {
      await dockerComposeDown();
    }

    try {
      const metadataFilePath = resolve(
        librariesPath,
        libraryName,
        "metadata.yaml"
      );
      const text = await readFile(metadataFilePath, "utf-8");
      const yaml = load(text);
      defaultsDeep(result, yaml);
    } catch (e) {
      if (e.code !== "ENOENT") {
        console.error("error loading metadata file");
        console.error(e);
      }
    }
  }

  generateMarkdown(results);

  await writeFile(
    resolve(__dirname, "..", "results.json"),
    JSON.stringify(results, null, 2),
    "utf-8"
  );

  console.log("complete");
  process.exit();
}

main().catch(console.error);
