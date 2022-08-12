package com.example.demo

import com.example.demo.model.DeprecatedProduct
import com.expediagroup.graphql.server.operations.Query
import org.springframework.stereotype.Component

@Component
class DeprecatedProductQuery : Query {
    @Deprecated("Use product query instead")
    fun deprecatedProduct(sku: String, `package`: String) = DeprecatedProduct.bySkuAndPackage(sku, `package`)
}
