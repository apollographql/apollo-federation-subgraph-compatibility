package com.example.demo.model

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.generator.federation.directives.FieldSet
import com.expediagroup.graphql.generator.federation.directives.KeyDirective
import com.expediagroup.graphql.generator.federation.directives.ProvidesDirective
import com.expediagroup.graphql.generator.federation.directives.TagDirective
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeResolver
import com.expediagroup.graphql.generator.scalars.ID
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

val PRODUCTS = listOf(
    Product(
        ID("apollo-federation"),
        "federation",
        "@apollo/federation",
        ProductVariation(ID("OSS")),
        ProductDimension("small", 1.0f, "kg"),
        User(email = "support@apollographql.com", name = "Jane Smith", totalProductsCreated = 1337)
    ),
    Product(
        ID("apollo-studio"),
        "studio",
        "",
        ProductVariation(ID("platform")),
        ProductDimension("small", 1.0f, "kg"),
        User(email ="support@apollographql.com", name = "Jane Smith", totalProductsCreated = 1337)
    )
)

/*
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
 */
@KeyDirective(fields = FieldSet("id"))
@KeyDirective(fields = FieldSet("sku package"))
@KeyDirective(fields = FieldSet("sku variation { id }"))
data class Product(
    val id: ID,
    val sku: String? = null,
    @GraphQLName("package")
    val pkg: String? = null,
    val variation: ProductVariation? = null,
    val dimensions: ProductDimension? = null,
    @ProvidesDirective(FieldSet("totalProductsCreated"))
    val createdBy: User? = null,
    @TagDirective("internal")
    val notes: String? = null
) {
    companion object {
        fun byID(id: ID) = PRODUCTS.find { it.id.value == id.value }
        private fun bySkuAndPackage(sku: String, pkg: String) = PRODUCTS.find { it.sku == sku && it.pkg == pkg }
        private fun bySkuAndVariation(sku: String, variationId: String) =
            PRODUCTS.find { it.sku == sku && it.variation?.id?.value == variationId }

        fun byReference(ref: Map<String, Any>): Product? {
            val id = ref["id"]?.toString()
            val sku = ref["sku"]?.toString()
            val pkg = ref["package"]?.toString()
            val variation = ref["variation"]
            val variationId = if (variation is Map<*, *>) {
                variation["id"].toString()
            } else null

            return when {
                id != null -> byID(ID(id))
                sku != null && pkg != null -> bySkuAndPackage(sku, pkg)
                sku != null && variationId != null -> bySkuAndVariation(sku, variationId)
                else -> throw RuntimeException("invalid entity reference")
            }
        }
    }
}

@Component
class ProductsResolver : FederatedTypeResolver<Product> {
    override val typeName: String = "Product"

    override suspend fun resolve(
        environment: DataFetchingEnvironment,
        representations: List<Map<String, Any>>
    ): List<Product?> = representations.map {
        Product.byReference(it)
    }
}
