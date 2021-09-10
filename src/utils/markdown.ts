import { writeFileSync } from "fs";
import { resolve } from "path";
import { TestResult, TESTS } from "../testRunner";

export function generateMarkdown(results: { [key: string]: TestResult }) {
  const markdownFile = new MarkdownFile(
    "Subgraph libraries that support Apollo Federation",
    "Supported subgraph libraries"
  );

  const PER_TABLE = 4;
  const groups = [...Object.values(results)].reduce(
    (acc, result) => {
      if (acc[acc.length - 1].length >= PER_TABLE) acc.push([]);
      acc[acc.length - 1].push(result);
      return acc;
    },
    [[]] as TestResult[][]
  );

  for (const table of groups) {
    markdownFile.addOneTable(table);
  }

  writeFileSync(
    resolve(__dirname, "..", "..", "results.md"),
    markdownFile.toString(),
    "utf-8"
  );
}

const METADATA = [
  { row: "Language/Runtime", key: "language" },
  { row: "Version", key: "version" },
  {
    row: "Documentation",
    key: "documentation",
    fn: (d: string) => `*[Link](${d})*`,
  },
  {
    row: "Dependencies",
    key: "dependencies",
    fn: (ds: { name: string; url: string; version: string }[]) =>
      ds.map((d) => `*[${d.name}](${d.url})@${d.version}*`).join("<br>"),
  },
];

class MarkdownFile {
  private content: string[] = [];

  constructor(title: string, sidebarTitle: string) {
    this.content.push(
      "---",
      `title: ${title}`,
      `sidebar_title: ${sidebarTitle}`,
      "---",
      "",
      "The following open-source GraphQL server libraries provide support for Apollo Federation and are included in our test suite",
      ""
    );
  }

  addOneTable(frameworks: TestResult[]) {
    const footnotes = new FootnoteCollector();

    const columns = ["", ...frameworks.map((t) => t.fullName ?? t.name)];
    this.content.push(`| ${columns.join(" | ")} |`);
    this.content.push(
      `| ${new Array(columns.length)
        .fill(1)
        .map(() => "---")
        .join(" | ")} |`
    );

    for (const { row, key, fn } of METADATA) {
      const values = [
        `*${row}*`,
        ...frameworks.map((f) => {
          const v = f[key];
          if (v && fn) return `${fn(v)}`;
          return v ? `*${v}*` : "";
        }),
      ];

      this.content.push(`| ${values.join(" | ")} |`);
    }

    for (const { column, assertion } of TESTS) {
      const values = [
        `**${column}**`,
        ...frameworks.map((f) => {
          const sym = f.tests[assertion]?.success ? "✔️" : "❌";
          if (f.tests[assertion]?.caveat) {
            const ast = footnotes.add(f.tests[assertion]?.caveat);
            return `${sym} ${ast}`;
          }
          return sym;
        }),
      ];

      this.content.push(`| ${values.join(" | ")} |`);
    }
    this.content.push("");
    this.content.push(...footnotes.lines());
    this.content.push("");
  }

  toString() {
    return this.content.join("\n");
  }
}

class FootnoteCollector {
  private footnotes = new Map<string, string>();

  add(s: string) {
    if (!this.footnotes.has(s)) {
      this.footnotes.set(s, "*".repeat(this.footnotes.size + 1));
    }
    return this.footnotes.get(s);
  }

  lines() {
    return [...this.footnotes.entries()].map(
      ([str, sym]) => `\\${sym} ${str}  ` // trailing spaces are important!
    );
  }
}
