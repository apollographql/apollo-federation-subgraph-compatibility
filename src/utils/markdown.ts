import { writeFileSync } from "fs";
import { resolve } from "path";
import { TestResult, TESTS } from "../testRunner";

export function generateMarkdown(results: { [key: string]: TestResult }) {
  const markdownFile = new MarkdownFile(
    "Subgraph libraries that support Apollo Federation",
    "Supported subgraph libraries"
  );

  Object.values(results).forEach((result) => {
    markdownFile.addFrameworkResultToTable(result);
  });

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
    this.addTable();
  }

  addTable() {
    const columns = [
      "Language",
      "Library",
      "Federation 1 Support",
      "Federation 2 Support",
    ];
    this.content.push(`| ${columns.join(" | ")} |`);
    this.content.push(
      `| ${new Array(columns.length)
        .fill(1)
        .map(() => "---")
        .join(" | ")} |`
    );
  }

  addFrameworkResultToTable(result: TestResult) {
    const name = result.fullName || result.name;
    const rows = [
      result.language,
      result.documentation ? `[${name}](${result.documentation})` : name,
      this.renderTestResultsCell({ fedVersion: 1, result }),
      this.renderTestResultsCell({ fedVersion: 2, result }),
    ];
    this.content.push(`| ${rows.join(" | ")} |`);
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
