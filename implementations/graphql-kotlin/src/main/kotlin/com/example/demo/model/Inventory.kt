package com.example.demo.model

import com.expediagroup.graphql.generator.federation.directives.FieldSet
import com.expediagroup.graphql.generator.federation.directives.InterfaceObjectDirective
import com.expediagroup.graphql.generator.federation.directives.KeyDirective
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeSuspendResolver
import com.expediagroup.graphql.generator.scalars.ID
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

/*
type Inventory @interfaceObject @key(fields: "id") {
  id: ID!
  deprecatedProducts: [DeprecatedProduct!]!
}
 */
@KeyDirective(fields = FieldSet("id"))
@InterfaceObjectDirective
data class Inventory(val id: ID) {
    fun deprecatedProducts(): List<DeprecatedProduct> = listOf(DEPRECATED_PRODUCT)
}

@Component
class InventoryResolver : FederatedTypeSuspendResolver<Inventory> {
    override val typeName: String = "Inventory"

    override suspend fun resolve(
        environment: DataFetchingEnvironment,
        representation: Map<String, Any>
    ): Inventory? {
        return if (representation["id"] == "apollo-oss") {
            Inventory(ID("apollo-oss"))
        } else {
            null
        }
    }
}
