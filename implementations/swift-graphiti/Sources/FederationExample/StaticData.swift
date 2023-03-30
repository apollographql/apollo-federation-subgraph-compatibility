import Foundation

// Static data for the example, can be replaced with a database or another API in production code.

struct StaticData {
    static func dimensions() async -> [ProductDimension] {
        [
            ProductDimension(
                size: "small",
                weight: 1,
                unit: "kg"
            )
        ]
    }

    static func users() async -> [User] {
        [
            User(
                email: "support@apollographql.com",
                name: "Jane Smith",
                totalProductsCreated: 1337,
                yearsOfEmployment: 10
            ),
        ]
    }

    static func deprecatedProducts() async -> [DeprecatedProduct] {
        await [
            DeprecatedProduct(
                sku: "apollo-federation-v1",
                package: "@apollo/federation-v1",
                reason: "Migrate to Federation V2",
                createdBy: users()[0]
            ),
        ]
    }

    static func productsResearch() async -> [ProductResearch] {
        [
            ProductResearch(
                study: CaseStudy(
                    caseNumber: "1234",
                    description: "Federation Study"
                ),
                outcome: nil
            ),
            ProductResearch(
                study: CaseStudy(
                    caseNumber: "1235",
                    description: "Studio Study"
                ),
                outcome: nil),
        ]
    }

    static func products() async -> [Product] {
        await [
            Product(
                id: "apollo-federation",
                sku: "federation",
                package: "@apollo/federation",
                variation: ProductVariation(
                    id: "OSS"
                ),
                dimensions: dimensions()[0],
                createdBy: users()[0],
                notes: nil,
                research: [productsResearch()[0]]
            ),
            Product(
                id: "apollo-studio",
                sku: "studio",
                package: "",
                variation: ProductVariation(
                    id: "platform"
                ),
                dimensions: dimensions()[0],
                createdBy: users()[0],
                notes: nil,
                research: [productsResearch()[1]]
            ),
        ]
    }

    static func inventorys() async -> [Inventory] {
        await [
            Inventory(
                id: "apollo-oss",
                deprecatedProducts: deprecatedProducts())
        ]
    }
}
