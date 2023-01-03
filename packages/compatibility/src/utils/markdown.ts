import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { TestResultDetails, TestResults, TESTS } from '../testRunner';

export function generateMarkdown(results: TestResultDetails[]) {
  const markdownFile = new MarkdownFile(true);

  const resultsSortedByLanguage = results.sort((a, b) => {
    if (a.language === b.language) return 0;

    // push other solutions to the end
    if (a.language === 'Other Solutions') return 1;
    if (b.language === 'Other Solutions') return -1;

    return a.language > b.language ? 1 : -1;
  });

  var currentLanguage = null;
  resultsSortedByLanguage.forEach((result) => {
    if (currentLanguage !== result.language) {
      if (currentLanguage !== null) {
        markdownFile.endTable();
      }

      markdownFile.startTable(result);
      currentLanguage = result.language;
    }
    markdownFile.addFrameworkResultToTable(result);
  });
  markdownFile.endTable();

  writeFileSync(
    resolve(process.cwd(), 'results.md'),
    markdownFile.toString(),
    'utf-8',
  );
}

export function generateSimplifiedMarkdown(
  results: TestResults,
  outputFile: string,
) {
  const markdownFile = new MarkdownFile();

  markdownFile.startTable();
  markdownFile.addTestResultsToTable(results);
  markdownFile.endTable();

  writeFileSync(outputFile, markdownFile.toString(), 'utf-8');
}

class MarkdownFile {
  private content: string[] = [];

  constructor(includeLegend?: Boolean) {
    if (includeLegend) {
      let intro = `---
title: Federation-compatible subgraph implementations

hide:
  - navigation
---

The following open-source GraphQL server libraries and other solutions support acting as a subgraph in a federated supergraph.

## Table Legend

| Icon | Description                                          |
| ---- | ---------------------------------------------------- |
| 🟢    | Functionality is supported                           |
| ❌    | Critical functionality is NOT supported              |
| 🔲    | Additional federation functionality is NOT supported |

`;

      this.content.push(intro);
    }
  }

  startTable(result?: TestResultDetails) {
    let headers = '<th>Federation 1 Support</th><th>Federation 2 Support</th>';
    if (result) {
      this.content.push('', `## ${result.language}`, '');
      headers = '<th width="300">Library</th>' + headers;
    }

    this.content.push(
      '<table>',
      '<thead>',
      `<tr>${headers}</tr>`,
      '</thead>',
      '<tbody>',
    );
  }

  endTable() {
    this.content.push('</tbody>', '</table>');
  }

  addFrameworkResultToTable(result: TestResultDetails) {
    const name = result.fullName || result.name;
    const rows = [
      result.documentation
        ? `<a href="${result.documentation}">${name}</a>`
        : name,
      this.renderTestResultsCell({ fedVersion: 1, testResults: result.tests }),
      this.renderTestResultsCell({ fedVersion: 2, testResults: result.tests }),
    ];
    let tableRow = '<tr>';
    rows.forEach((row) => {
      tableRow += `<td>${row}</td>`;
    });
    tableRow += '</tr>';
    this.content.push(tableRow);
  }

  addTestResultsToTable(results: TestResults) {
    const rows = [
      this.renderTestResultsCell({ fedVersion: 1, testResults: results }),
      this.renderTestResultsCell({ fedVersion: 2, testResults: results }),
    ];
    let tableRow = '<tr>';
    rows.forEach((row) => {
      tableRow += `<td>${row}</td>`;
    });
    tableRow += '</tr>';
    this.content.push(tableRow);
  }

  renderTestResultsCell({
    fedVersion,
    testResults,
  }: {
    fedVersion: number;
    testResults: TestResults;
  }) {
    let cell = '<table>';
    TESTS.forEach((test) => {
      if (test.fedVersion === fedVersion) {
        cell += `<tr><th><code>${test.column}</code></th><td>${
          testResults[test.assertion]?.success
            ? '🟢'
            : test.required
            ? '❌'
            : '🔲'
        }</td></tr>`;
      }
    });
    cell += '</table>';
    return cell;
  }

  toString() {
    return this.content.join('\n');
  }
}
