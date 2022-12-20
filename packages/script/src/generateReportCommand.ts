#!/usr/bin/env node

import { generateReport } from '@apollo/federation-subgraph-compatibility-tests';
import { Command } from 'commander';

const program = new Command();

program
    .description('Generate Apollo Federation Compatibility report.')
    .argument('<result.json>', 'compatibility results in JSON format')
    .action((resultsFile) => {
        generateReport(resultsFile);
    })
    .showHelpAfterError();

program.parseAsync(process.argv).catch((error) => {
    console.error(error);
});
