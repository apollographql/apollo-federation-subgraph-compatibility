import Foundation
import Graphiti

struct Product: Codable {
    let id: ID
    let sku: String?
    let package: String?
    let variation: ProductVariation?
    let dimensions: ProductDimension?
    let createdBy: User?
    let notes: String?
    let research: [ProductResearch]

    struct EntityKey1: Codable {
        let id: ID
    }

    struct EntityKey2: Codable {
        let sku: String
        let package: String
    }

    struct EntityKey3: Codable {
        let sku: String
        let variation: VariationKey

        struct VariationKey: Codable {
            let id: ID
        }
    }
}

struct DeprecatedProduct: Codable {
    let sku: String
    let package: String
    let reason: String?
    let createdBy: User?

    struct EntityKey: Codable {
        let sku: String
        let package: String
    }
}

struct ProductVariation: Codable {
    let id: ID
}

struct ProductResearch: Codable {
    let study: CaseStudy
    let outcome: String?

    struct EntityKey: Codable {
        let study: CaseStudyKey

        struct CaseStudyKey: Codable {
            let caseNumber: ID
        }
    }
}

struct CaseStudy: Codable {
    let caseNumber: ID
    let description: String?
}

struct ProductDimension: Codable {
    let size: String?
    let weight: Float?
    let unit: String?
}

struct User: Codable {
    let email: ID
    let name: String?
    let totalProductsCreated: Int?
    let yearsOfEmployment: Int

    var averageProductsCreatedPerYear: Int? {
        guard let totalProductsCreated = totalProductsCreated else { return nil }
        return totalProductsCreated / yearsOfEmployment
    }

    struct EntityKey: Codable {
        let email: ID
    }
}

struct Inventory: Codable {
    let id: ID
    let deprecatedProducts: [DeprecatedProduct]

    struct EntityKey: Codable {
        let id: ID
    }
}

struct ID: Codable, ExpressibleByStringLiteral, Equatable {
    var value: String

    init(stringLiteral value: String) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        self.value = try container.decode(String.self)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(value)
    }
}
