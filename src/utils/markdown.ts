import { writeFileSync } from "fs";
import { resolve } from "path";
import { TestResult, TESTS } from "../testRunner";

export function generateMarkdown(results: Map<string, TestResult>) {
  const markdownFile = new MarkdownFile(
    "Subgraph libraries that support Apollo Federation",
    "Supported subgraph libraries"
  );

  for (const [_, result] of results) {
    markdownFile.addFrameworkResultToTable(result);
  }

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
      `---\ntitle: ${title}\nsidebar_title: ${sidebarTitle}\n---\n`
    );
    this.content.push(
      `\nThe following open-source GraphQL server libraries provide support for Apollo Federation and are included in our test suite.\n\n`
    );
    this.addTable();
  }

  addTable() {
    const columns = ["Framework", ...TESTS.map((t) => t.column)];
    this.content.push(`| ${columns.join(" | ")} |`);
    this.content.push(
      `| ${new Array(columns.length)
        .fill(1)
        .map(() => "---")
        .join(" | ")} |`
    );
  }

  addFrameworkResultToTable(result: TestResult) {
    const rows = [
      result.name,
      ...TESTS.map((t) => {
        return result.tests[t.assertion]?.success ? "✔️" : "❌";
      }),
    ];
    this.content.push(`| ${rows.join(" | ")} |`);
  }

  toString() {
    return this.content.join("\n");
  }
}
