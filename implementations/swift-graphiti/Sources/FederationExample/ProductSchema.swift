import Foundation
import Graphiti
import GraphQL

final class ProductSchema: PartialSchema<ProductResolver, ProductContext> {
    @TypeDefinitions
    override var types: Types {
        Scalar(Float.self)
        Scalar(ID.self)
        
        Type(Product.self) {
            Field("id", at: \.id)
            Field("sku", at: \.sku)
            Field("package", at: \.package)
            Field("variation", at: \.variation)
            Field("dimensions", at: \.dimensions)
            Field("createdBy", at: \.createdBy)
            Field("notes", at: \.notes)
            Field("research", at: \.research)
        }
        .key(at: ProductResolver.resolveProduct) {
            Argument("id", at: \.id)
        }
        .key(at: ProductResolver.resolveProduct) {
            Argument("sku", at: \.sku)
            Argument("package", at: \.package)
        }
        .key(at: ProductResolver.resolveProduct) {
            Argument("sku", at: \.sku)
            Argument("package", at: \.variation)
        }
        
        Type(DeprecatedProduct.self) {
            Field("sku", at: \.sku)
            Field("package", at: \.package)
            Field("reason", at: \.reason)
            Field("createdBy", at: \.createdBy)
        }
        .key(at: ProductResolver.resolveDeprecatedProduct) {
            Argument("sku", at: \.sku)
            Argument("package", at: \.package)
        }
        
        Type(ProductVariation.self) {
            Field("id", at: \.id)
        }

        Type(ProductResearch.self) {
            Field("study", at: \.study)
            Field("outcome", at: \.outcome)
        }
        .key(at: ProductResolver.resolveProductResearch) {
            Argument("study", at: \.study)
        }

        Type(CaseStudy.self) {
            Field("caseNumber", at: \.caseNumber)
            Field("description", at: \.description)
        }

        Type(ProductDimension.self) {
            Field("size", at: \.size)
            Field("weight", at: \.weight)
            Field("unit", at: \.unit)
        }

        Type(User.self) {
            Field("email", at: \.email)
            Field("name", at: \.name)
            Field("totalProductsCreated", at: \.totalProductsCreated)
            Field("yearsOfEmployment", at: \.yearsOfEmployment)
            Field("averageProductsCreatedPerYear", at: \.averageProductsCreatedPerYear)
        }
        .key(at: ProductResolver.resolveUser) {
            Argument("email", at: \.email)
        }

        Type(Inventory.self) {
            Field("id", at: \.id)
            Field("deprecatedProducts", at: \.deprecatedProducts)
        }
        .key(at: ProductResolver.resolveInventory) {
            Argument("id", at: \.id)
        }
    }

    @FieldDefinitions
    override var query: Fields {
        Field("product", at: ProductResolver.product) {
            Argument("id", at: \.id)
        }

        Field("deprecatedProduct", at: ProductResolver.deprecatedProduct) {
            Argument("sku", at: \.sku)
            Argument("package", at: \.package)
        }
        .deprecationReason("Use product query instead")
    }
}
