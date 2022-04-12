# Apollo Federation Subgraph Library Compatibility Testing Strategy

The purpose of this repository is to provide a centralized strategy focused on understanding a given subgraph library's compatibility against the [Apollo Federation Specification](https://www.apollographql.com/docs/federation/federation-spec/).

## Latest Results

The following open-source GraphQL server libraries provide support for Apollo Federation and are included in our test suite.

| Language | Library | Federation 1 Support | Federation 2 Support |
| --- | --- | --- | --- |
| C# (.NET) | [GraphQL for .NET](https://graphql-dotnet.github.io) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>❌</td></tr><tr><th>@key (composite)</th><td>❌</td></tr><tr><th>@requires</th><td>❌</td></tr><tr><th>@provides</th><td>❌</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| C# (.NET) | [Hot Chocolate](https://chillicream.com/docs/hotchocolate) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Elixir (Absinthe) | [Absinthe.Federation](https://github.com/DivvyPayHQ/absinthe_federation) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Go | [gqlgen](https://gqlgen.com) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Java / Kotlin | [dgs-framework](https://github.com/netflix/dgs-framework/) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Java / Kotlin | [Federation JVM](https://github.com/apollographql/federation-jvm) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table> | <table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Java / Kotlin | [GraphQL Kotlin](https://github.com/ExpediaGroup/graphql-kotlin) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| JavaScript / TypeScript | [Apollo Server](https://www.apollographql.com/docs/federation/) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table> | <table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table> |
| JavaScript / TypeScript | [express-graphql](https://github.com/graphql/express-graphql) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table> |
| JavaScript / TypeScript | [Mercurius](https://mercurius.dev/#/) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Multiple | [AWS AppSync](https://aws.amazon.com/appsync/) | <table><tr><th>_service</th><td>❌</td></tr><tr><th>@key (single)</th><td>❌</td></tr><tr><th>@key (multi)</th><td>❌</td></tr><tr><th>@key (composite)</th><td>❌</td></tr><tr><th>@requires</th><td>❌</td></tr><tr><th>@provides</th><td>❌</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| PHP | [Apollo Federation PHP](https://github.com/Skillshare/apollo-federation-php) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| PHP (Laravel) | [Lighthouse](https://lighthouse-php.com/) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Python | [Ariadne](https://ariadnegraphql.org/docs/apollo-federation) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>❌</td></tr><tr><th>@key (composite)</th><td>❌</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Python | [Graphene](https://graphene-python.org/) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>❌</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>❌</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Python | [Strawberry](https://strawberry.rocks) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Ruby | [GraphQL Ruby](https://graphql-ruby.org/) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Rust | [Async-graphql](https://async-graphql.github.io/async-graphql/en/index.html) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |
| Scala | [Caliban](https://ghostdogpr.github.io/caliban/docs/federation.html) | <table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table> | <table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table> |

If you want to see a library added to this list, feel free to open an [Issue](https://github.com/apollographql/apollo-federation-subgraph-compatibility/issues) or check our our [Apollo Federation Library Maintainers Implementation Guide](./CONTRIBUTORS.md) to see about submitting a PR for your library!

## Testing Suite

This repository contains a structured testing suite based on a federated schema that covers the [Apollo Federation Specification](https://www.apollographql.com/docs/federation/federation-spec/). The federated schema is constructued of 3 subgraphs (`users`, `inventory` and `products`) that will be started and used to test various libraries that support Apollo Federation. The `users` and `inventory` subgraphs are provided by this repository in addition to the graph router instance. Library implementors will each implement the `products` schema and provide a docker file that can be used with `docker compose`; templates for these files are provided along with examples.

## Subgraph Schemas

### Users

```graphql
type User @key(fields: "email") {
  email: ID!
  name: String
  totalProductsCreated: Int
}
```

### Inventory

```graphql
extend type Product @key(fields: "id") {
  id: ID! @external
  dimensions: ProductDimension @external
  delivery(zip: String): DeliveryEstimates
    @requires(fields: "dimensions { size weight }")
}

type ProductDimension @shareable {
  size: String
  weight: Float
}

type DeliveryEstimates {
  estimatedDelivery: String
  fastestDelivery: String
}
```

### Products (schema to be implemented by library maintainers)

```graphql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.0",
    import: [
      "@key",
      "@shareable",
      "@provides",
      "@external",
      "@tag",
      "@extends",
      "@override",
      "@inaccessible"
    ]
  )

type Product
  @key(fields: "id")
  @key(fields: "sku package")
  @key(fields: "sku variation { id }") {
  id: ID!
  sku: String
  package: String
  variation: ProductVariation
  dimensions: ProductDimension
  createdBy: User @provides(fields: "totalProductsCreated")
  notes: String @tag(name: "internal")
}

type ProductVariation {
  id: ID!
}

type ProductDimension @shareable {
  size: String
  weight: Float
  unit: String @inaccessible
}

extend type Query {
  product(id: ID!): Product
}

extend type User @key(fields: "email") {
  email: ID! @external
  name: String @override(from: "users")
  totalProductsCreated: Int @external
}
```

## Testing Spec Compliance

- `_service` - support a `rover subgraph introspect` command (this is the Apollo Federation equivalent of Introspection for subgraphs)
  - `query { _service { sdl } }`
- `@key` and `_entities` - support defining a single `@key`, multiple `@key` definitions, multiple-fields `@key` and a complex fields `@key`. Below is an example of the single `@key` query that is sent from the graph router to the implementing `products` subgraph (the variables will be changed to test all `@key` definitions):

```graphql
query ($representations: [_Any!]!) {
    _entities(representations: [{ "__typename": "Product", "id": "apollo-federation" }]) {
        ...on Product {sku package variation { id } dimensions { size weight }
        }
    }
}
```

- `@requires` - support defining complex fields
  - This will be tested through a query covering [Product.delivery](http://product.delivery) where the library implementors dimensions { size weight } will need to be an expected { size: "1", weight: 1 } to pass. Example query that will be sent directly to `products` subgraph.

```graphql
query ($id: ID!) {
  product(id: $id) {
    dimensions {
      size
      weight
    }
  }
}
```

- `@provides` - This will be covered by the library implementors at Product.createdBy where they will be expected to provide the User.totalProductsCreated to be _anything_ _other than 4_

```graphql
query ($id: ID!) {
  product(id: $id) {
    createdBy {
      email
      totalProductsCreated
    }
  }
}
```

- `@external` - This is covered in the tests above.
- `extends` or `@extends` - This is covered in the `products` subgraph extension of the `User`
- `ftv1` (Federated Traces version 1) - A query with the `apollo-federated-include-trace:ftv1` header will be sent to the `products` subgraph which should return a value for the `extensions.ftv1` in the result.
  - _NOTE: In the initial release of this testing strategy, we will not be validating `ftv1` to ensure it's in the proper format_
- `@link`
  - Must be seen as a valid schema directive in the subgraph library service sdl. Is verified by checking for its inclusion in the `query { _service { sdl } }` result.
- `@tag`
  - Must be seen as a valid schema directive in the subgraph library service sdl. Is verified by checking for its inclusion in the `query { _service { sdl } }` result.
- `@shareable`
  - Must be seen as a valid schema directive in the subgraph library service sdl. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to query shareable types.
- `@override`
  - Must be seen as a valid schema directive in the subgraph library service sdl. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to return the value of an overridden field.
- `@inaccessible`
  - Must be seen as a valid schema directive in the subgraph library service sdl. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to query inaccessible fields from the Products schema.

## Setting up the testing suite

1. `npm install`
2. `npm run setup`
   - `npm run build` - compiles typescript code and composes supergraph SDL
   - `npm run docker` - build docker images for `graph-router`, `users` and `inventory`

## Running the Test

`npm run test` will test all folders in the `implementations` folder. You can provide a comma separated string as an additional argument to test only specific libraries.

## Test Results

A `results.md` file will be created that displays the testing results

## Contributing a new library to this test suite

Fork this repository and navigate to the [Apollo Federation Library Maintainers Implementation Guide](./CONTRIBUTORS.md) for implementation instructions. Once you've completed the implementations instructions, feel free to create a PR and we'll review it. If you have any questions please open a GitHub issue on this repository.
