# Apollo Federation Subgraph Compatibility Testing Monorepo

[![Join the community forum](https://img.shields.io/badge/Join%20The%20Community-Forum-blueviolet)](https://community.apollographql.com)
[![MIT License](https://img.shields.io/github/license/apollographql/apollo-federation-subgraph-compatibility)](https://github.com/apollographql/apollo-federation-subgraph-compatibility/blob/main/LICENSE)

This monorepo contains test suite that verifies subgraphs compatibility against [Apollo Federation Subgraph Specification](https://www.apollographql.com/docs/federation/subgraph-spec/). This testing suite verifies various Federation features against subgraph implementation. See [compatibility testing docs](./COMPATIBILITY.md) for details on the expected schema and the data sets as well as information about the executed tests. Test suite is packaged as NPX script and [Github Action](https://github.com/apollographql/apollo-federation-subgraph-compatibility-action).

This repository also contains number of [example subgraph implementations](https://github.com/apollographql/apollo-federation-subgraph-compatibility/tree/main/implementations) based on various libraries and other solutions. See [latest compatibility results](https://www.apollographql.com/docs/federation/building-supergraphs/supported-subgraphs) for a list of Apollo Federation compatibible subgraph implementations.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for general contribution guidelines and [Apollo Federation Subgraph Maintainers Implementation Guide](./SUBGRAPH_GUIDE.md) for subgraph implementation instructions. Once you've completed the implementations instructions, feel free to create a PR and we'll review it. If you have any questions please open a GitHub issue on this repository.

## Contact

If you have a specific question about the testing library or code, please start a discussion in the [Apollo community forums](https://community.apollographql.com/).

## Security

For more info on how to contact the team for security issues, see our [Security Policy](https://github.com/apollographql/.github/blob/main/SECURITY.md).

## License

This library is licensed under [The MIT License (MIT)](https://github.com/apollographql/apollo-federation-subgraph-compatibility/blob/main/LICENSE).
