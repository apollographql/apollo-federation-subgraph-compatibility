# Apollo Federation Library Maintainers Implementation Guide

This doc is mean to provide Apollo Federation Library Maintainers with the necessary information to test their library against The Apollo Federation Spec

## Why should I even do this?

You've built a library and that should be celebrated! We want to build a stronger community around Apollo Federation and that includes us supporting you as a core maintainer! The Apollo Federation spec can potentially change overtime along with each implementing libraries `graphql` implementation (`graphql-js` vs `graphql-ruby` for example). This test suite should help identify scenarios where something is not working as epected early and Apollo can help provide guidance on what specifically might need to change. 

Dependabot will be setup in the near future to ensure that any changes to underlying packages will rerun the test suite and open an issue if there are any regressions. 

## How can I have my library included in this?

It's actually pretty easy! We have a `products` schema that you will need to implement to be used in the testing suite:

1. Copy the `src/implementations/_template_` folder and rename it to the name of your library
   * You'll find 3 files that you need in the template folder: `docker-compose.yml`, `Dockerfile` and `products.graphql`
2. You'll need to implement the `products.graphql` file in your server, this is the reference implementation
3. Once you have the schema implemented, you'll need to modify the `Dockerfile` to make your server a Docker image and expose it on port 4001
   * We will send traffic to `http://products:4001`, if your server has `/graphql` required you'll need to change it
4. You most likely don't need to modify the `docker-compose.yml` file, but it will be use for `docker compose` to test your implementation. If you do need to edit the `docker-compose.yml` file, your edits should only affect the `products` service defined.
5. Test only your library by running `npm run test {YOUR_IMPLEMENTATION_FOLDER_NAME}` and the results will be outputted to `results.md`

### Expected Data Sets

Below is data that is used in this testing strategy and what you should be using in your server (it is okay to just hardcode this and return values directly from the array, this is what is done in `apollo-server` and `federation-jvm`)

```javascript
const products = [
    { id: 'apollo-federation', sku: 'federation', package: '@apollo/federation', variation: "OSS" },
    { id: 'apollo-studio', sku: 'studio', package: '', variation: "platform" }
]
```

## Debugging the projects 

There are debugging launch configurations established for all subgraphs provided to your along with the Graph Router.
In VSCode, you can open the debugger panel and debug any of the following:

* Debug Test - This debugs the actual test suite script
* Debug Graph Router - This launches/debugs the `ApolloGateway` instance
* Debug Users - This launches the `users` `ApolloServer` instance locally (not by the docker image). You can set break points in the resolver code as needed to explore.
* Debug Inventory - This launches the `inventory` `ApolloServer` instance locally (not by the docker image). You can set break points in the resolver code as needed to explore

### Debugging other implementations

It is not required to include debugging capabilities for every library, but it is very helpful. The follow libraries also have debug launch configurations established:

* Debug Products:apollo-server (TypeScript) 
* Debug Products:federation-jvm (Java) 