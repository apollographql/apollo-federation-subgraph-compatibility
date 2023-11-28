import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { TestResultDetails, TestResults, TESTS } from '../testRunner';
import Mustache from 'mustache';

const template = `
The following open-source GraphQL server libraries and other solutions support acting as a subgraph in a federated supergraph.

## Table Legend

| Icon | Description                                          |
| ---- | ---------------------------------------------------- |
| {{{apolloIcon}}} | Maintained by Apollo |
| 🟢    | Functionality is supported                           |
| ❌    | Critical functionality is NOT supported              |
| 🔲    | Additional federation functionality is NOT supported |

{{#compatibilityResults}}

## {{{language}}}

<table>
  <thead>
    <tr>
      <th width="300">Library</th>
      <th>Federation 1 Support</th>
      <th>Federation 2 Support</th>
    </tr>
  </thead>
	<tbody>
    {{#implementations}}
		<tr>
			<th colspan="3"><big><a href="{{{documentation}}}">{{name}}</a></big></th>
		</tr>
		<tr>
			<td>{{description}}<br/>
<br/>
{{#repository}}
Github: <a href="{{{link}}}">{{{name}}}{{#apolloIcon}}&nbsp;&nbsp;{{{apolloIcon}}}{{/apolloIcon}}</a><br/>
<br/>
{{#type}}Type: {{{type}}}<br/>{{/type}}
{{#stargazerCount}}Stars: {{stargazerCount}} ⭐<br/>{{/stargazerCount}}
{{#lastRelease}}Last Release: {{lastRelease}}<br/>{{/lastRelease}}
{{/repository}}
<br/>
{{#coreLibrary}}
Core Library: <a href="{{{link}}}">{{{name}}}{{#apolloIcon}}&nbsp;&nbsp;{{{apolloIcon}}}{{/apolloIcon}}</a><br/>
{{/coreLibrary}}
{{#federationLibrary}}
Federation Library: <a href="{{{link}}}">{{{name}}}{{#apolloIcon}}&nbsp;&nbsp;{{{apolloIcon}}}{{/apolloIcon}}</a>
{{/federationLibrary}}
      </td>
      {{#compatibilities}}
      <td>
        <table>
        {{#tests}}
          <tr><th><code>{{name}}</code></th><td>{{result}}</td></tr>
        {{/tests}}
        </table>
      </td>
      {{/compatibilities}}
    </tr>
    {{/implementations}}
  </tbody>
</table>
{{/compatibilityResults}}
`;

const singleImplementationTemplate = `
<table>
	<thead>
		<tr>
			<th>Federation 1 Support</th>
			<th>Federation 2 Support</th>
		</tr>
	</thead>
	<tbody>
    <tr>
      {{#compatibilities}}
      <td>
        <table>
        {{#tests}}
          <tr><th><code>{{name}}</code></th><td>{{result}}</td></tr>
        {{/tests}}
        </table>
      </td>
      {{/compatibilities}}
		</tr>
	</tbody>
</table>
`;

const apolloIcon: string =
  '<img style="display:inline-block; height:1em; width:auto;" alt="Maintained by Apollo" src="https://apollo-server-landing-page.cdn.apollographql.com/_latest/assets/favicon.png"/>';
const apolloName: string = 'apollographql';

interface CompatibilityResults {
  language: string;
  implementations: SubgraphImplementation[];
}

interface SubgraphImplementation {
  name: string;
  documentation: string;
  description: string;
  repository?: ProjectGithubRepository;
  coreLibrary?: GithubRepository;
  federationLibrary?: GithubRepository;
  compatibilities: FederationCompatibility[];
}

interface GithubRepository {
  name: string;
  link: string;
  apolloIcon?: string;
}

interface ProjectGithubRepository extends GithubRepository {
  type?: string;
  stargazerCount?: string;
  lastRelease?: string;
}

interface FederationCompatibility {
  version: Number;
  tests: FederationTest[];
}

interface FederationTest {
  name: string;
  result: string;
}

export function generateMarkdown(results: TestResultDetails[]) {
  const resultsSortedByLanguage = results.sort((a, b) => {
    if (a.language === b.language) return 0;

    // push other solutions to the end
    if (a.language === 'Other Solutions') return 1;
    if (b.language === 'Other Solutions') return -1;

    return a.language > b.language ? 1 : -1;
  });

  let compatibilityResults: CompatibilityResults[] = [];
  var current: CompatibilityResults = null;
  var currentLanguage = null;
  resultsSortedByLanguage.forEach((result) => {
    if (currentLanguage !== result.language) {
      if (currentLanguage !== null) {
        compatibilityResults.push(current);
      }
      currentLanguage = result.language;
      current = {
        language: currentLanguage,
        implementations: [],
      };
    }
    let impl: SubgraphImplementation = {
      name: result.fullName || result.name,
      documentation: result.documentation,
      description: result.description,
      compatibilities: generateCompatibilityResults(result.tests),
    };

    if (result.repository) {
      const starCount = Number(result.stargazerCount);
      let stars = null;
      if (starCount > 1000) {
        stars = `${(starCount / 1000).toFixed(1)}k`;
      } else {
        stars = `${starCount}`;
      }
      const lastReleaseDate = result.lastRelease?.substring(0, 10);
      let repoName = result.repository.owner
        ? `${result.repository.owner}/${result.repository.name}`
        : result.repository.name;

      impl.repository = {
        name: repoName,
        link: result.repository.link,
        apolloIcon:
          apolloName == result.repository.maintainer ? apolloIcon : null,
        type: result.type,
        stargazerCount: stars,
        lastRelease: lastReleaseDate,
      };
    }

    if (result.coreLibrary) {
      let coreLibraryName = result.coreLibrary.owner
        ? `${result.coreLibrary.owner}/${result.coreLibrary.name}`
        : result.coreLibrary.name;
      impl.coreLibrary = {
        name: coreLibraryName,
        link: result.coreLibrary.link,
        apolloIcon:
          apolloName == result.coreLibrary.maintainer ? apolloIcon : null,
      };
    }

    if (result.federationLibrary) {
      let fedLibraryName = result.federationLibrary.owner
        ? `${result.federationLibrary.owner}/${result.federationLibrary.name}`
        : result.federationLibrary.name;
      impl.federationLibrary = {
        name: fedLibraryName,
        link: result.federationLibrary.link,
        apolloIcon:
          apolloName == result.federationLibrary.maintainer ? apolloIcon : null,
      };
    }
    current.implementations.push(impl);
  });
  // push the last results section
  compatibilityResults.push(current);

  var output = Mustache.render(template, {
    compatibilityResults: compatibilityResults,
    apolloIcon: apolloIcon,
  });

  writeFileSync(resolve(process.cwd(), 'results.md'), output, 'utf-8');
}

export function generateSimplifiedMarkdown(
  results: TestResults,
  outputFile: string,
) {
  let compatibilityResults = generateCompatibilityResults(results);
  var output = Mustache.render(singleImplementationTemplate, {
    compatibilities: compatibilityResults,
  });

  writeFileSync(outputFile, output, 'utf-8');
}

function generateCompatibilityResults(
  results: TestResults,
): FederationCompatibility[] {
  let compatibilities = [
    {
      version: 1,
      tests: [],
    },
    {
      version: 2,
      tests: [],
    },
  ];
  TESTS.forEach((test) => {
    let index = test.fedVersion - 1;
    let testResult = results[test.assertion]?.success
      ? '🟢'
      : test.required
      ? '❌'
      : '🔲';
    compatibilities[index].tests.push({
      name: test.column,
      result: testResult,
    });
  });
  return compatibilities;
}
