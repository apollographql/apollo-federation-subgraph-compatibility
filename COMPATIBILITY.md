# Apollo Federation Spec Compliance

This repository contains a structured testing suite based on a federated schema that covers the [Apollo Federation Specification](https://www.apollographql.com/docs/federation/federation-spec/). The federated supergraph is constructued of 3 subgraphs (`users`, `inventory` and `products`) that will be used to test various libraries that support Apollo Federation. The `users` and `inventory` subgraphs are provided by this repository in addition to the graph router instance. Subgraph implementors should implement the `products` schema with the expected data set.

When adding subgraph implementation to be included in the compatibility results, implementations should provide a docker file that can be used with `docker compose`. Templates for these files are provided along with examples. See [Apollo Federation Subgraph Maintainers Implementation Guide](./SUBGRAPH_GUIDE.md) for details.

- [Supergraph Schemas](#subgraph-schemas)
- [Expected Data Sets](#expected-data-sets)
- [Test Suite](#testing-spec-compliance)

## Supergraph Schemas

### Users

```graphql
type User @key(fields: "email") {
  email: ID!
  name: String
  totalProductsCreated: Int @shareable
  yearsOfEmployment: Int!
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

interface Inventory @key(fields: "id") {
  id: ID!
  products: [Product!]!
}

type OpenSourceInventory implements Inventory @key(fields: "id") {
  id: ID!
  products: [Product!]!
}

type Query {
  inventory(id: ID!): Inventory
}
```

### Products (schema to be implemented by library maintainers)

```graphql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.3",
    import: [
      "@composeDirective",
      "@extends",
      "@external",
      "@inaccessible",
      "@interfaceObject",
      "@key",
      "@override",
      "@provides",
      "@requires",
      "@shareable",
      "@tag"
    ]
  )
  @link(url: "https://myspecs.dev/myCustomDirective/v1.0", import: ["@custom")
  @composeDirective(name: "@custom")

directive @custom on OBJECT

type Product
  @custom
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
    research: [ProductResearch!]!
}

type DeprecatedProduct @key(fields: "sku package") {
  sku: String!
  package: String!
  reason: String
  createdBy: User
}

type ProductVariation {
  id: ID!
}

type ProductResearch @key(fields: "study { caseNumber }") {
  study: CaseStudy!
  outcome: String
}

type CaseStudy {
  caseNumber: ID!
  description: String
}

type ProductDimension @shareable {
  size: String
  weight: Float
  unit: String @inaccessible
}

extend type Query {
  product(id: ID!): Product
  deprecatedProduct(sku: String!, package: String!): DeprecatedProduct @deprecated(reason: "Use product query instead")
}

extend type User @key(fields: "email") {
  averageProductsCreatedPerYear: Int @requires(fields: "totalProductsCreated yearsOfEmployment")
  email: ID! @external
  name: String @override(from: "users")
  totalProductsCreated: Int @external
  yearsOfEmployment: Int! @external
}

type Inventory @interfaceObject @key(fields: "id") {
  id: ID!
  deprecatedProducts: [DeprecatedProduct!]!
}
```

## Expected Data Sets

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

const inventory = {
  id: "apollo-oss",
  deprecatedProducts: [deprecatedProduct]
}
```

## Testing Spec Compliance

Following tests are run to verify Federation Spec compliance.

### Minimum functionality to support Apollo Federation

This is a minimum set of functionality to allow for API-side joins and use of entities in other subgraphs.

- `_service` - support a `rover subgraph introspect` command (this is the Apollo Federation equivalent of Introspection for subgraphs)
  - executes `query { _service { sdl } }` and verifies the contents of the SDL
- `@key` and `_entities` - support defining a single `@key`
  - Below is an example of the single `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
    _entities(representations: [{ "__typename": "User", "email": "support@apollographql.com" }]) {
        ...on User { email name }
      }
    }
}
```

- `@link` (required for Federation v2)
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result.

### Additional functionality to fully support Apollo Federation

- `@key` and `_entities` - multiple `@key` definitions, multiple-fields `@key` and a composite object fields `@key`
  - Below is an example of a multiple fields `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
  _entities(representations: [{ "__typename": "DeprecatedProduct", "sku": "apollo-federation-v1", "package": "@apollo/federation-v1" }]) {
    ...on DeprecatedProduct { sku package reason }
  }
}
```

  - Below is an example of a composite object fields `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
  _entities(representations: [{ "__typename": "ProductResearch", "study": { "caseNumber": "1234" } }]) {
    ...on ProductResearch { study { caseNumber description } }
  }
}
```

  - Below is an example of a multiple `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
  _entities(representations: [
     { "__typename": "Product", "id: "apollo-federation" },
     { "__typename": "Product", "sku": "federation", "package": "@apollo/federation" },
     { "__typename": "Product", "sku": "studio", "variation": { "id": "platform" } }
  ]) {
    ...on Product { id sku }
  }
}
```

- `@requires` - directive used to provide additional non-key information from one subgraph to the computed fields in another subgraph, should support defining complex fields
- - This will be covered by the subgraph implementors at `Product.createdBy` where they will be expected to provide the `User.averageProductsCreatedPerYear` using `yearsOfEmployment` value provided by the `user` graph and the `totalProductsCreated` value from the implementing `products` subgraph. Example query that will be sent directly to `products` subgraph.

```graphql
query ($id: ID!) {
  product(id: $id) {
    createdBy {
      averageProductsCreatedPerYear
      email
    }
  }
}
```

- `@provides` - directive used for path denormalization
  - This will be covered by the subgraph implementors at `Product.createdBy` where they will be expected to provide the `User.totalProductsCreated` to be _anything_ _other than 4_

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

- `@external` - directive used to mark fields as external (defined in other subgraph). This is covered in the tests above.
- `extends` or `@extends` - ability to extend the type that is defined in other subgraph
  - This is covered in the `products` subgraph extension of the `User`
- Federated Traces version 1 (`ftv1`)
  - A query with the `apollo-federated-include-trace:ftv1` header will be sent to the `products` subgraph which should return a value for the `extensions.ftv1` in the result.
  - _NOTE: In the initial release of this testing strategy, we will not be validating `ftv1` to ensure it's in the proper format_
- `@tag` - directive used to add arbitrary metadata information to the schema elements. Used by [Apollo Contracts](https://www.apollographql.com/docs/studio/contracts/) to expose different variants of the schema.
  - **Cannot be `@federation__` namespaced** - this directive has to be named consistently as `@tag` across all the subgraphs
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result.
- `@shareable` - directive that provides ability to relax single source of truth for entity fields
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to query shareable types.
- `@override` - directive used for migrating fields between subgraphs
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to return the value of an overridden field.
- `@inaccessible` - directive used to hide fields from the supergraph
  - **Cannot be `@federation__` namespaced** - this directive has to be named consistently as `@inacessible` across all the subgraphs
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to query inaccessible fields from the Products schema.
