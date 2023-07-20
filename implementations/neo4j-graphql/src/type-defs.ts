import { gql } from "graphql-tag";

export const typeDefs = gql`
    extend schema
        @link(
            url: "https://specs.apollo.dev/federation/v2.3"
            import: [
                "@composeDirective"
                "@extends"
                "@external"
                "@key"
                "@inaccessible"
                "@interfaceObject"
                "@override"
                "@provides"
                "@requires"
                "@shareable"
                "@tag"
            ]
        )
        @link(
            url: "https://myspecs.dev/myCustomDirective/v1.0"
            import: ["@custom"]
        )
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
            @relationship(type: "HAS_VARIATION", direction: OUT)
        dimensions: ProductDimension
            @relationship(type: "HAS_DIMENSIONS", direction: OUT)
        createdBy: User
            @provides(fields: "totalProductsCreated")
            @relationship(type: "CREATED_BY", direction: OUT)
        notes: String @tag(name: "internal")
        research: [ProductResearch!]!
            @relationship(type: "HAS_RESEARCH", direction: OUT)
    }

    type DeprecatedProduct @key(fields: "sku package") {
        sku: String!
        package: String!
        reason: String
        createdBy: User @relationship(type: "CREATED_BY", direction: OUT)
    }

    type ProductVariation {
        id: ID!
    }

    type ProductResearch @key(fields: "study { caseNumber }") {
        study: CaseStudy! @relationship(type: "HAS_STUDY", direction: OUT)
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

    type Query {
        product(id: ID!): Product
            @cypher(
                statement: "MATCH (product:Product) WHERE product.id = $id RETURN product"
                columnName: "product"
            )
        deprecatedProduct(sku: String!, package: String!): DeprecatedProduct
            @deprecated(reason: "Use product query instead")
            @cypher(
                statement: "MATCH (product:DeprecatedProduct) WHERE product.sku = $sku AND product.package = $package = $id RETURN product"
                columnName: "product"
            )
    }

    # Originally using extends keyword, but this fails our document validation
    type User @key(fields: "email") @extends {
        averageProductsCreatedPerYear: Int
            @requires(fields: "totalProductsCreated yearsOfEmployment")
        email: ID! @external
        name: String @override(from: "users")
        totalProductsCreated: Int @external
        yearsOfEmployment: Int! @external
    }

    type Inventory @interfaceObject @key(fields: "id") {
        id: ID!
        deprecatedProducts: [DeprecatedProduct!]!
            @relationship(type: "HAS_DEPRECATED_PRODUCT", direction: OUT)
    }
`;
