# federated subgraph with sangria

Implementation of a federated subgraph based on the scala library [sangria](https://sangria-graphql.github.io/).

## Practical information

There are several ways to define a GraphQL schema with sangria.
Here we are using a code first schema generation.
And we are splitting the domain model and the GraphQL schema. This ensures separation of concerns.

On the other hand, this approach needs more lines of code.
If your goal is to have less lines of code, you could mix the domain and the GraphQL and use the [automatic derivation](https://sangria-graphql.github.io/learn/#macro-based-graphql-type-derivation).

## Usage

### Starting the GraphQL server

```
sbt run
```

### Printing the GraphQL schema (SQL)

```
sbt "run printSchema"
```
