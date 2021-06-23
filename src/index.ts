import { readdirSync } from "fs";
import { resolve } from "path";
import { spawn } from "child_process";
import { GraphClient } from "./utils/client";
import { generateMarkdown } from "./utils/markdown";

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

function getFolderNamesFromPath(path: string) {
    return readdirSync(path, {
        withFileTypes: true,
    })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}

function barrier(): [Promise<void>, () => void] {
    let r: () => void;
    const p = new Promise<void>((resolve) => (r = resolve));
    // @ts-ignore
    return [p, r];
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
}
interface SugraphImplementations {
    language: string;
    framework: string;
}

let results = new Map<string, TestResult>();

async function runDockerCompose(libraryName: string, librariesPath: string) {
    const [dockerComposePromise, dockerComposeObtained] = barrier();
    const dockerExpose = spawn('docker', ['compose', 'up'], { cwd: resolve(librariesPath, libraryName) });

    dockerExpose.on("spawn", () => {
        setTimeout(() => dockerComposeObtained(), 30000)
    });
    dockerExpose.on("exit", (code, signal) => {
        if (code == 0) results.get(libraryName).startedSuccessfully = true;
        dockerComposeObtained();
    });

    await dockerComposePromise;
    dockerExpose.removeAllListeners("exit");
    dockerExpose.removeAllListeners("spawn");

    return dockerExpose;
}

(async () => {
    GraphClient.init();

    //npm install will also setup project by building docker images along with supergraph sdl
    const { libraries }: { libraries: string } = yargs(hideBin(process.argv)).argv;

    const librariesPath = resolve(__dirname, '..', 'src', "implementations");
    const libraryNames = libraries ? libraries.split(",") : getFolderNamesFromPath(librariesPath);

    for (const libraryName of libraryNames) {
        if (libraryName == '_template_') continue;

        results.set(libraryName, new TestResult());

        const composedGraphForLibrary = await runDockerCompose(libraryName, librariesPath);
        try {
            const startupSuccess = await GraphClient.instance.pingSources();
            if (startupSuccess) {
                console.log(`Library ${libraryName} started successfully`);
                let thing = results.get(libraryName);

                thing.startedSuccessfully = true;
                thing.serviceSdl = await GraphClient.instance.check_service();
                thing.keySupport.singleField = await GraphClient.instance.check_key_single();
                thing.keySupport.multipleFields = await GraphClient.instance.check_key_multiple();
                thing.keySupport.composite = await GraphClient.instance.check_key_composite();
                thing.requiresSupport = await GraphClient.instance.check_requires();
                thing.providesSupport = await GraphClient.instance.check_provides();

                console.log(`Library ${libraryName} complete!`);
            } else {
                results.get(libraryName).startedSuccessfully = false;
                console.log(`Library ${libraryName} was not started successfully`);
            }
        } catch (err) {
            console.log(`Library ${libraryName} encountered an error: ${err}`);
        } finally {
            composedGraphForLibrary.kill(0);
        }
    }

    generateMarkdown(results);

    console.log('complete');
    process.exit();
})();