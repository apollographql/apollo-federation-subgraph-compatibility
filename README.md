# Apollo Federation Subgraph Library Compatibility Testing Strategy

The purpose of this repository is to provide a centralized strategy focused on understanding a given subgraph library's compatibility against the [Apollo Federation Specification](https://www.apollographql.com/docs/federation/federation-spec/).

# Latest Results

The following open-source GraphQL server libraries provide support for Apollo Federation and are included in our test suite.

* [C# / .NET](#c--net)
* [Elixir](#elixir)
* [Go](#go)
* [Java / Kotlin](#java--kotlin)
* [JavaScript / TypeScript](#javascript--typescript)
* [Multi-language](#multi-language)
* [PHP](#php)
* [Python](#python)
* [Ruby](#ruby)
* [Rust](#rust)
* [Scala](#scala)

## C# / .NET

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://graphql-dotnet.github.io">GraphQL for .NET</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>❌</td></tr><tr><th>@key (composite)</th><td>❌</td></tr><tr><th>@requires</th><td>❌</td></tr><tr><th>@provides</th><td>❌</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
<tr><td><a href="https://chillicream.com/docs/hotchocolate">Hot Chocolate</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## Elixir

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/DivvyPayHQ/absinthe_federation">Absinthe.Federation</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## Go

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://gqlgen.com">gqlgen</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
</tbody>
</table>

## Java / Kotlin

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/netflix/dgs-framework/">dgs-framework</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
<tr><td><a href="https://github.com/apollographql/federation-jvm">Federation JVM</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
<tr><td><a href="https://github.com/graphql-java-kickstart/graphql-spring-boot">GraphQL Java Kickstart (Spring Boot)</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
<tr><td><a href="https://github.com/ExpediaGroup/graphql-kotlin">GraphQL Kotlin</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
</tbody>
</table>

## JavaScript / TypeScript

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://www.apollographql.com/docs/federation/">Apollo Server</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
<tr><td><a href="https://github.com/graphql/express-graphql">express-graphql</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
<tr><td><a href="https://www.graphql-yoga.com/docs/features/apollo-federation">GraphQL Yoga</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
<tr><td><a href="https://mercurius.dev/#/">Mercurius</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## Multi-language

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://aws.amazon.com/appsync/">AWS AppSync</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## PHP

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://lighthouse-php.com/">Lighthouse (Laravel)</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
<tr><td><a href="https://github.com/Skillshare/apollo-federation-php">Apollo Federation PHP</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## Python

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://ariadnegraphql.org/docs/apollo-federation">Ariadne</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
<tr><td><a href="https://graphene-python.org/">Graphene</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>❌</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>❌</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
<tr><td><a href="https://strawberry.rocks">Strawberry</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
</tbody>
</table>

## Ruby

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://graphql-ruby.org/">GraphQL Ruby</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## Rust

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://async-graphql.github.io/async-graphql/en/index.html">Async-graphql</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>❌</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>❌</td></tr><tr><th>@tag</th><td>❌</td></tr><tr><th>@override</th><td>❌</td></tr><tr><th>@inaccessible</th><td>❌</td></tr></table></td></tr>
</tbody>
</table>

## Scala

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://ghostdogpr.github.io/caliban/docs/federation.html">Caliban</a></td><td><table><tr><th>_service</th><td>✅</td></tr><tr><th>@key (single)</th><td>✅</td></tr><tr><th>@key (multi)</th><td>✅</td></tr><tr><th>@key (composite)</th><td>✅</td></tr><tr><th>@requires</th><td>✅</td></tr><tr><th>@provides</th><td>✅</td></tr><tr><th>@ftv1</th><td>✅</td></tr></table></td><td><table><tr><th>@link</th><td>✅</td></tr><tr><th>@shareable</th><td>✅</td></tr><tr><th>@tag</th><td>✅</td></tr><tr><th>@override</th><td>✅</td></tr><tr><th>@inaccessible</th><td>✅</td></tr></table></td></tr>
</tbody>
</table>


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
