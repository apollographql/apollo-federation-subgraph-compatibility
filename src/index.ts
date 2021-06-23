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
let results = new Map<string, TestResult>();

async function runDockerCompose(libraryName: string, librariesPath: string) {
    const [dockerComposePromise, dockerComposeObtained] = barrier();
    const dockerCompose = spawn('docker-compose', ['up', '--build'], { cwd: resolve(librariesPath, libraryName) });
    let started = false;

    dockerCompose.stdout.on("data", (message) => {
        console.log(message.toString());
    });
    dockerCompose.on("spawn", () => {
        if (!started)
            setTimeout(() => dockerComposeObtained(), 30000)
    });
    dockerCompose.on("exit", (code, signal) => {
        if (code == 0) {
            results.get(libraryName).startedSuccessfully = true;
            if (!started)
                setTimeout(() => dockerComposeObtained(), 30000)
        } else {
            //Error running command, we can exit without waiting
            dockerComposeObtained();
        }
    });

    await dockerComposePromise;
    dockerCompose.removeAllListeners("exit");
    dockerCompose.removeAllListeners("spawn");
    dockerCompose.stdout.removeAllListeners("data")

    return dockerCompose;
}

async function stopDockerCompose(libraryName: string, librariesPath: string) {
    const [dockerComposePromise, dockerComposeObtained] = barrier();
    const dockerCompose = spawn('docker-compose', ['down', '-f="docker-compose.yml"'], { cwd: resolve(librariesPath, libraryName) });

    dockerCompose.stdout.on("data", (message) => {
        console.log(message.toString());
    });
    dockerCompose.on("spawn", () => {
        setTimeout(() => dockerComposeObtained(), 15000)
    });
    dockerCompose.on("exit", (code, signal) => {
        if (code == 0) results.get(libraryName).startedSuccessfully = true;
        dockerComposeObtained();
    });

    await dockerComposePromise;

    dockerCompose.removeAllListeners("exit");
    dockerCompose.removeAllListeners("spawn");
    dockerCompose.stdout.removeAllListeners("data")
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
            await stopDockerCompose(libraryName, librariesPath);
            composedGraphForLibrary.kill(0);
        }
    }

    generateMarkdown(results);

    console.log('complete');
    process.exit();
})();