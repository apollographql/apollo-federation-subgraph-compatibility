import Foundation

struct ProductResolver {
    struct ProductArguments: Codable {
        let id: ID
    }

    func product(context: ProductContext, arguments: ProductArguments) async -> Product? {
        await context.db.products().first { $0.id == arguments.id }
    }

    struct DeprecatedProductArguments: Codable {
        let sku: String
        let package: String
    }

    func deprecatedProduct(context: ProductContext, arguments: DeprecatedProductArguments) async -> DeprecatedProduct? {
        await context.db.deprecatedProducts().first { $0.sku == arguments.sku && $0.package == arguments.package }
    }

    // Federation Entities

    func resolveProduct(context: ProductContext, arguments: Product.EntityKey1) async -> Product? {
        await context.db.products().first { $0.id == arguments.id }
    }

    func resolveProduct(context: ProductContext, arguments: Product.EntityKey2) async -> Product? {
        await context.db.products().first { $0.sku == arguments.sku && $0.package == arguments.package }
    }

    func resolveProduct(context: ProductContext, arguments: Product.EntityKey3) async -> Product? {
        await context.db.products().first { $0.sku == arguments.sku && $0.variation?.id == arguments.variation.id }
    }

    func resolveDeprecatedProduct(context: ProductContext, arguments: DeprecatedProduct.EntityKey) async -> DeprecatedProduct? {
        await context.db.deprecatedProducts().first { $0.sku == arguments.sku && $0.package == arguments.package }
    }

    func resolveProductResearch(context: ProductContext, arguments: ProductResearch.EntityKey) async -> ProductResearch? {
        await context.db.productsResearch().first { $0.study.caseNumber == arguments.study.caseNumber }
    }

    func resolveUser(context: ProductContext, arguments: User.EntityKey) async -> User? {
        await context.db.users().first { $0.email == arguments.email }
    }

    func resolveInventory(context: ProductContext, arguments: Inventory.EntityKey) async -> Inventory? {
        await context.db.inventorys().first { $0.id == arguments.id }
    }
}
