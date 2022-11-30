import { Debugger } from "debug";
import { Writable } from "stream";
import { TestResults, TESTS } from "../testRunner";

/**
 * Log message with a timestamp.
 */
export function logWithTimestamp(message: string) {
    console.log(new Date().toJSON(), message);
}

/**
 * Log compatibility test results to console.
 */
export function logResults(testResults: TestResults) {
    console.log("*************\nFederation v1 compatibility\n*************");
    TESTS.forEach((test) => {
        if (test.fedVersion === 1) {
            console.log(test.column, testResults[test.assertion]?.success ? "PASS" : test.required ? "FAIL" : "WARNING");
        }
    });
    console.log("\n*************\nFederation v2 compatibility\n*************");
    TESTS.forEach((test) => {
        if (test.fedVersion === 2) {
            console.log(test.column, testResults[test.assertion]?.success ? "PASS" : test.required ? "FAIL" : "WARNING");
        }
    });
}

/**
 * Writable debug stream that uses Debugger to indicate whether message should be logged or not.
 */
export function writeableDebugStream(debug: Debugger) {
    return new Writable({
        write(chunk, _encoding, next) {
            debug(chunk.toString());
            next();
        },
    });
}