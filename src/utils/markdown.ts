import { TestResult } from "..";
import { writeFileSync } from "fs";
import { resolve } from "path";

export function generateMarkdown(results: Map<string, TestResult>) {
    const markdownFile = new MarkdownFile("Subgraph libraries that support Apollo Federation", "Supported subgraph libraries");
    results.forEach((result, framework) => markdownFile.addFrameworkResultToTable(framework, result));

    writeFileSync(resolve(__dirname, '..', '..', 'results.md'), markdownFile.content, { encoding: 'utf-8' });
}

class MarkdownFile {
    content: string = "";

    constructor(title: string, sidebarTitle: string) {
        this.content = `---\ntitle: ${title}\nsidebar_title: ${sidebarTitle}\n---\n`;
        this.content += `\nThe following open-source GraphQL server libraries provide support for Apollo Federation and are included in our test suite.\n\n`;
        this.addTable();
    }

    addTable() {
        this.content += `| Framework | _service | @key (single) | @key (multi) | @key (composite) | @requires | @provides | ftv1 |\n`;
        this.content += `| --- | --- | --- | --- | --- | --- | --- | --- |\n`;

    }
    addFrameworkResultToTable(framework: string, result: TestResult) {
        this.content += `| ${framework} `;
        this.content += result.serviceSdl ? this.check() : this.cross();
        this.content += result.keySupport.singleField ? this.check() : this.cross();
        this.content += result.keySupport.multipleFields ? this.check() : this.cross();
        this.content += result.keySupport.composite ? this.check() : this.cross();
        this.content += result.requiresSupport ? this.check() : this.cross();
        this.content += result.providesSupport ? this.check() : this.cross();
        this.content += result.ftv1Support ? `${this.check()} |` : `${this.cross()} |`;
        this.content += '\n'
    }
    addText(text: string) {
        this.content += `${text}\n`
    }

    private check(): string { return "| ✔️ " }
    private cross(): string { return "| ❌ " }

}