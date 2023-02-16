package com.example.demo.model

import com.expediagroup.graphql.generator.federation.directives.*
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeResolver
import com.expediagroup.graphql.generator.scalars.ID
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component
import kotlin.math.roundToInt
import kotlin.properties.Delegates

val DEFAULT_USER = User(email = ID("support@apollographql.com"), name = "Jane Smith", totalProductsCreated = 1337)

/*
extend type User @key(fields: "email") {
  averageProductsCreatedPerYear: Int @requires(fields: "totalProductsCreated yearsOfEmployment")
  email: ID! @external
  name: String @override(from: "users")
  totalProductsCreated: Int @external
  yearsOfEmployment: Int! @external
}
 */
@KeyDirective(fields = FieldSet("email"))
@ExtendsDirective
data class User(
    @ExternalDirective
    val email: ID,
    @OverrideDirective(from = "users")
    val name: String?,
    @ExternalDirective
    var totalProductsCreated: Int? = null
) {
    @ExternalDirective
    var yearsOfEmployment: Int by Delegates.notNull()

    @RequiresDirective(fields = FieldSet("totalProductsCreated yearsOfEmployment"))
    fun averageProductsCreatedPerYear(): Int? = totalProductsCreated?.let { totalCount ->
        (1.0f * totalCount / yearsOfEmployment).roundToInt()
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
            val email = it["email"]?.toString() ?: throw RuntimeException("invalid entity reference")
            val user = User(email = ID(email), name = "Jane Smith", totalProductsCreated = 1337)
            it["totalProductsCreated"]?.toString()?.toIntOrNull()?.let { totalProductsCreated ->
                user.totalProductsCreated = totalProductsCreated
            }
            it["yearsOfEmployment"]?.toString()?.toIntOrNull()?.let { yearsOfEmployment ->
                user.yearsOfEmployment = yearsOfEmployment
            }
            user
        }
    }
}
