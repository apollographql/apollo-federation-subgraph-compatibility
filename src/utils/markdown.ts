import { writeFileSync } from "fs";
import { resolve } from "path";
import { TestResult, TESTS } from "../testRunner";

export function generateMarkdown(results: TestResult[]) {
  const markdownFile = new MarkdownFile(
    "Subgraph libraries that support Apollo Federation",
    "Supported subgraph libraries"
  );

  const resultsSortedByLanguage = results.sort((a, b) => {
    if (a.language === b.language) return 0;

    // push hosted solutions to the end
    if (a.language === "Hosted Solutions") return 1;
    if (b.language === "Hosted Solutions") return -1;

    return a.language > b.language ? 1 : -1;
  });

  var currentLanguage = null;
  resultsSortedByLanguage.forEach((result) => {
    if (currentLanguage !== result.language) {
      if (currentLanguage !== null) {
        markdownFile.endLanguageTable();
      }

      markdownFile.startLanguageTable(result);
      currentLanguage = result.language;
    }
    markdownFile.addFrameworkResultToTable(result);
  });
  markdownFile.endLanguageTable();

  writeFileSync(
    resolve(__dirname, "..", "..", "results.md"),
    markdownFile.toString(),
    "utf-8"
  );
}

class MarkdownFile {
  private content: string[] = [];

  constructor(title: string, sidebarTitle: string) {
    this.content.push(
      "---",
      `title: ${title}`,
      `sidebar_title: ${sidebarTitle}`,
      "---",
      "",
      "The following open-source GraphQL server libraries provide support for Apollo Federation and are included in our test suite.",
      ""
    );
  }

  startLanguageTable(result: TestResult) {
    this.content.push("", `## ${result.language}`, "");
    this.content.push("<table>", 
      "<thead>", 
      "<tr><th width=\"300\">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>", 
      "</thead>",
      "<tbody>"
    );
  }

  endLanguageTable() {
    this.content.push("</tbody>", "</table>");
  }

  addFrameworkResultToTable(result: TestResult) {
    const name = result.fullName || result.name;
    const rows = [
      result.documentation ? `<a href="${result.documentation}">${name}</a>` : name,
      this.renderTestResultsCell({ fedVersion: 1, result }),
      this.renderTestResultsCell({ fedVersion: 2, result }),
    ];
    let tableRow = "<tr>";
    rows.forEach((row) => {
      tableRow += `<td>${row}</td>`;
    });
    tableRow += "</tr>"
    this.content.push(tableRow);
  }

  renderTestResultsCell({
    fedVersion,
    result,
  }: {
    fedVersion: number;
    result: TestResult;
  }) {
    let cell = "<table>";
    TESTS.forEach((test) => {
      if (test.fedVersion === fedVersion) {
        cell += `<tr><th>${test.column}</th><td>${
          result.tests[test.assertion]?.success ? "✅" : "❌"
        }</td></tr>`;
      }
    });
    cell += "</table>";
    return cell;
  }

  toString() {
    return this.content.join("\n");
  }
}
