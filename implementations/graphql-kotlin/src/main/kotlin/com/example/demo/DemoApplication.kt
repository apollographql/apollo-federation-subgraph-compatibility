package com.example.demo

import com.expediagroup.graphql.generator.annotations.GraphQLName
import com.expediagroup.graphql.generator.federation.directives.*
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeResolver
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@KeyDirective(fields = FieldSet("id"))
data class Product(
    val id: ID,
    val sku: String? = null,
    @GraphQLName("package")
    val pkg: String? = null,
    val variation: ProductVariation? = null,
    val dimensions: ProductDimension? = null,
    @ProvidesDirective(FieldSet("totalProductsCreated"))
    val createdBy: User? = null
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

val PRODUCTS = listOf(
    Product(
        ID("apollo-federation"),
        "federation",
        "@apollo/federation",
        ProductVariation(ID("OSS")),
        ProductDimension("1", 1.0f),
        User("support@apollographql.com", totalProductsCreated = 1337)
    ),
    Product(
        ID("apollo-studio"),
        "studio",
        "",
        ProductVariation(ID("platform")),
        ProductDimension("1", 1.0f),
        User("support@apollographql.com", totalProductsCreated = 1337)
    )
)

data class ProductDimension(
    val size: String? = null,
    val weight: Float? = null
)

data class ProductVariation(
    val id: ID
)

@KeyDirective(fields = FieldSet("email"))
@ExtendsDirective
data class User(
    @ExternalDirective
    val email: String,
    @ExternalDirective
    val totalProductsCreated: Int? = null
)

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

@Component
class UserResolver : FederatedTypeResolver<User> {
    override val typeName: String = "User"

    override suspend fun resolve(
        environment: DataFetchingEnvironment,
        representations: List<Map<String, Any>>
    ): List<User?> {
        return representations.map {
            val email = it["email"].toString() ?: throw RuntimeException("invalid entity reference")
            User(email, totalProductsCreated = 1337)
        }
    }
}

@Component
class ProductQuery : Query {
    fun product(id: ID) = Product.byID(id)
}

@Component
class CorsFilter : WebFilter {
    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        exchange.response.headers.add("Access-Control-Allow-Origin", "*")
        exchange.response.headers.add("Access-Control-Allow-Method", "GET, POST")
        exchange.response.headers.add("Access-Control-Allow-Headers", "content-type")
        return chain.filter(exchange)
    }
}

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
