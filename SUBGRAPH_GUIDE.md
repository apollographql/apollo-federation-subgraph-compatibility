# Apollo Federation Subgraph Maintainers Implementation Guide

This document provides Apollo Federation Subgraph Maintainers with the
necessary information to test their implementation against The Apollo Federation Spec.

## Why should I even do this?

You've built a library and that should be celebrated! We want to build a
stronger community around Apollo Federation and that includes us supporting you
as a core maintainer! The Apollo Federation spec can potentially change over
time along with each implementing libraries `graphql` implementation (`graphql-js`
vs `graphql-ruby` for example). This test suite should help identify scenarios
where something is not working as expected early and Apollo can help provide
guidance on what specifically might need to change.

Dependabot will be setup in the near future to ensure that any changes to
underlying packages will rerun the test suite and open an issue if there are
any regressions.

## How can I have my library included in this?

It's actually pretty easy! We have a `products` schema that you will need to
implement to be used in the testing suite:

1. Copy the `implementations/_template_library_` folder and rename it to the
   name of your library
   - You'll find 4 files that you need in the template folder: `metadata.json`,
     `docker-compose.yml`, `Dockerfile` and `products.graphql`
   - Creation of library `README.md` file is optional but highly encouraged. It
     should include some basic information about the library as well as the steps
     that describe how to build the example app and how to run it locally.
1. Update the `metadata.json` file with your project details. These details are
   used in our [federation-compatible subgraph](https://www.apollographql.com/docs/federation/building-supergraphs/supported-subgraphs/)
   documentation.
1. You'll need to implement the `products.graphql` file in your server, this is
   the reference implementation that will be tested.
2. Once you have the schema implemented, you'll need to modify the `Dockerfile`
   to make your server a Docker image and expose it on port 4001
   - We will send traffic to `http://products:4001`, if your server has
     `/graphql` required you'll need to change it
3. Modify the `docker-compose.yml` file and update the project name. If you do
   need to make additional edits to the `docker-compose.yml` file, your edits
   should only affect the `products` service defined.
4. Test only your library by running `make setup` and `make test subgraph={YOUR_IMPLEMENTATION_FOLDER_NAME}`
   and the results will be outputted to `results.mdx`
5. Copy the `.github/workflows/templates/test-subgraph-library.yaml.template` and rename
   it to include the name of your library under `.github/workflows/test-subgraph-<library>.yaml`
   - This is a workflow that will be triggered for PRs opened against your implementation.
   - Modify the template so it only triggers for your implementation.
6. Update `.github/workflows/comment.yaml` workflow to include name of your newly created workflow (
   this will enable automatic compatibility comments on PRs against your implementation).

## How can I have my hosted subgraph included in this?

Implement `products` schema and deploy it to your hosted environment. **Since the
builds can trigger at any time and the tests are executed against your deployed
GraphQL service, your service should be generally available as otherwise
compatibility tests will fail.**

1. Copy the `implementations/_template_hosted_` folder and rename it to the
   name of your solution.
   - You'll find 4 files that you need in the template folder: `metadata.json`, `github_metadata.json` (empty JSON file),
     `docker-compose.yml`, `Dockerfile`, `proxy.conf.template` and `products.graphql`
   - Creation of project `README.md` file is optional but highly encouraged.
     It should include some basic information about the solution.
2. Update `metadata.json` file with the project details. These details are
   used in our [federation-compatible subgraph](https://www.apollographql.com/docs/federation/building-supergraphs/supported-subgraphs/)
   documentation.
3. You'll need to implement the `products.graphql` file in your server and
   deploy it to your hosted environment, this is the reference implementation
   that will be tested. Calls should be authenticated with basic `x-api-key` header.
   - You can modify the `proxy.conf.template` to specify different authentication header.
4. Test only your library by running `make setup` and `make test subgraph={YOUR_IMPLEMENTATION_FOLDER_NAME}`
   and the results will be outputted to `results.mdx`. Since NGINX proxy will
   require API KEY and URL, you will need to set it as environment variable prior
   running tests.

   ```bash
   export API_KEY=bar
   export TEST_URL=http://example.com
   make test subgraph=foo
   ```

5. Copy the `.github/workflows/templates/test-subgraph-hosted.yaml.template` and rename
   it to include the name of your implementation under `.github/workflows/test-subgraph-<hosted>.yaml`
   - This is a workflow that will be triggered for PRs opened against your implementation.
   - Modify the template so it only triggers for your implementation.
6. Update `.github/workflows/test-hosted-subgraph.yaml` workflow
   - include name of your newly created workflow to trigger compatibility tests against your PR
   - include new conditional step to run tests against your subggraph

  ```yaml
    - name: (Conditional) <Hosted> compatibility test
      if: ${{ env.SUBGRAPH = '<hosted>' }}
      run: npm run compatibility:test -- docker --compose implementations/<hosted>/docker-compose.yaml --schema implementations/<hosted>/products.graphql
      env:
        API_KEY: ${{ secrets.API_KEY_<HOSTED> }}
        TEST_URL: ${{ secrets.URL_<HOSTED> }}
  ```

7. When you are ready to integrate, reach out to us at [Apollo Community Forums](https://community.apollographql.com/).
   Send a DM to any member of the [Ecosystem Group](https://community.apollographql.com/g/Ecosystem)
   and we'll help you configure your API KEY and URL as a Github Secret. Those secrets will be used
   by Github Actions to communicate with your server.

### Expected Data Sets

Below is data that is used in this testing strategy and what you should be using
in your server (it is okay to return hardcoded results, this is what is done in
`apollo-server` and `federation-jvm`).

```javascript
const dimension = {
  size: "small",
  weight: 1,
  unit: "kg"
}

const user = {
  averageProductsCreatedPerYear: if (totalProductsCreated) {
    Math.round(totalProductsCreated / yearsOfEmployment)
  } else {
    null
  },
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337,
  yearsOfEmployment: 10
 };

 const deprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
  createdBy: user
};

const productsResearch = [
  {
    study: {
      caseNumber: "1234",
      description: "Federation Study"
    },
    outcome: null
  },
  {
    study: {
      caseNumber: "1235",
      description: "Studio Study"
    },
    outcome: null
  },
]

const products = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: {
      id: "OSS"
    },
    dimensions: dimension,
    research: [productsResearch[0]]
    createdBy: user,
    notes: null
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: {
      id: "platform"
    },
    dimensions: dimension,
    research: [productsResearch[1]]
    createdBy: user,
    notes: null
  },
];
```

## Debugging at the command line

You can test your subgraph implementation locally by using `@apollo/federation-subgraph-compatibility` NPX script.
See [script documentation](packages/compatibility/README.md) for details.

## Debugging in VSCode

There are debugging launch configurations established for all subgraphs provided
to your along with the Graph Router.

In VSCode, you can open the debugger panel and debug any of the following:

- Debug Test - This debugs the actual test suite script
- Debug Users - This launches the `users` `ApolloServer` instance locally
  (not by the docker image). You can set break points in the resolver code as
  needed to explore.
- Debug Inventory - This launches the `inventory` `ApolloServer` instance
  locally (not by the docker image). You can set break points in the resolver
  code as needed to explore

### Debugging other implementations

It is not required to include debugging capabilities for every library, but it
is very helpful. The follow libraries also have debug launch configurations
established:

- Debug Products:apollo-server (TypeScript)
- Debug Products:federation-jvm (Java)
