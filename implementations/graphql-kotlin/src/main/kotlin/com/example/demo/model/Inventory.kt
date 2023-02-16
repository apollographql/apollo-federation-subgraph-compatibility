package com.example.demo.model

import com.expediagroup.graphql.generator.federation.directives.ExtendsDirective
import com.expediagroup.graphql.generator.federation.directives.ExternalDirective
import com.expediagroup.graphql.generator.federation.directives.FieldSet
import com.expediagroup.graphql.generator.federation.directives.InterfaceObjectDirective
import com.expediagroup.graphql.generator.federation.directives.KeyDirective
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeResolver
import com.expediagroup.graphql.generator.scalars.ID
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

/*
NOTE: @extends and @external are only required in graphql-kotlin v6, this was fixed in v7
type Inventory @extends @interfaceObject @key(fields: "id") {
  id: ID! @external
  deprecatedProducts: [DeprecatedProduct!]!
}
 */
@ExtendsDirective
@KeyDirective(fields = FieldSet("id"))
@InterfaceObjectDirective
data class Inventory(@ExternalDirective val id: ID) {
    fun deprecatedProducts(): List<DeprecatedProduct> = listOf(DEPRECATED_PRODUCT)
}

@Component
class InventoryResolver : FederatedTypeResolver<Inventory> {
    override val typeName: String = "Inventory"

    override suspend fun resolve(
        environment: DataFetchingEnvironment,
        representations: List<Map<String, Any>>
    ): List<Inventory?> {
        return representations.map {
            if (it["id"] == "apollo-oss") {
                Inventory(ID("apollo-oss"))
            } else {
                null
            }
        }
    }
}
