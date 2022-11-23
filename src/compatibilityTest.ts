#!/usr/bin/env node

import debug from "debug";
import { Command, Option } from 'commander';
import { startSupergraph } from './startSupergraph';
import { composeSupergraph } from "./composeSupergraph";
import { runJest, TestResults, TESTS } from './testRunner';
import { writeFile } from "fs/promises";
import { generateSimplifiedMarkdown } from "./utils/markdown";
import { logResults, logWithTimestamp } from "./utils/logging";
const program = new Command();

program
    .description(`Run Apollo Federation subgraph compatibility test`)
    .requiredOption("--endpoint <endpoint>", "subgraph endpoint")
    .option("--schema <schema file>", "optional schema file")
    .option("--config <PM2 configuration file>", "optional PM2 configuration file")
    // .option("--compose <compose file>", "Optional docker compose file")
    .option("--output <test results file name>", "optional output file name", "results.md")
    .addOption(new Option("--format <test results format>", "optional output file format").choices(["json", "markdown"]).default("markdown"))
    .option("--debug", "debug mode with extra log info")
    .showHelpAfterError();

program.parse(process.argv);

const options = program.opts();
if (options.debug) {
    debug.enable("debug,pm2,docker,rover,test");
}

async function compatibilityTests() {
    logWithTimestamp("******************************************************");
    logWithTimestamp("Starting Apollo Federation Subgraph Compatibility Test");
    logWithTimestamp("******************************************************");

    const testResults: TestResults = {};

    // start supergraph
    const stopSupergraph = await startSupergraph(options.config);
    try {
        await composeSupergraph(options.endpoint, options.schema);

        // run tests
        const { assertionPassed } = await runJest("compatibility");
        for (const { assertion } of TESTS) {
            testResults[assertion] = { success: assertionPassed(assertion) };
        }

        logWithTimestamp("compatibility tests complete...");
    } catch (err) {
        logWithTimestamp(`compatibility tests encountered an error: ${err}`);
    } finally {
        await stopSupergraph();
    }

    logWithTimestamp("generating results...");

    if (options.format == "markdown") {
        generateSimplifiedMarkdown(testResults, options.output);
    } else {
        await writeFile(
            options.output,
            JSON.stringify(testResults, null, 2),
            "utf-8"
        );
    }

    logWithTimestamp("compatibility test complete");
    // print results to console
    logResults(testResults);
    process.exit(0);
}

compatibilityTests().catch(console.error);