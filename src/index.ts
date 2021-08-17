import { readdirSync } from 'fs';
import { resolve } from 'path';
import { GraphClient } from './utils/client';
import { generateMarkdown } from './utils/markdown';
import execa from 'execa';

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
  const proc = execa('docker-compose', [
    '-f',
    'docker-compose.yaml',
    '-f',
    `${librariesPath}/${libraryName}/docker-compose.yaml`,
    'up',
    '--build',
    '--detach',
  ]);

  proc.stdin.pipe(process.stdin);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);

  await proc;

  if (proc.exitCode === 0) {
    results.get(libraryName).startedSuccessfully = true;
  } else {
    throw new Error('docker-compose did not start successfully');
  }

  return async () => {
    await execa('docker-compose', ['down', '--remove-orphans']);
  };
}

(async () => {
  GraphClient.init();

  // npm install will also setup project by building docker images along with supergraph sdl
  const libraries =
    process.argv.length > 2 ? (process.argv[2] as string) : undefined;

  const librariesPath = resolve(__dirname, '..', 'implementations');
  const implementationFolders = getFolderNamesFromPath(librariesPath);
  const libraryNames = libraries ? libraries.split(',') : implementationFolders;

  for (const libraryName of libraryNames) {
    if (libraryName == '_template_') continue;
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
      const startupSuccess = await GraphClient.instance.pingSources();

      if (startupSuccess) {
        console.log(`Library ${libraryName} started successfully`);
        let thing = results.get(libraryName);

        thing.startedSuccessfully = true;
        thing.serviceSdl = await GraphClient.instance.check_service();
        thing.keySupport.singleField =
          await GraphClient.instance.check_key_single();
        thing.keySupport.multipleFields =
          await GraphClient.instance.check_key_multiple();
        thing.keySupport.composite =
          await GraphClient.instance.check_key_composite();
        thing.requiresSupport = await GraphClient.instance.check_requires();
        thing.providesSupport = await GraphClient.instance.check_provides();
        thing.ftv1Support = await GraphClient.instance.check_ftv1();

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

  console.log('complete');
  process.exit();
})();
