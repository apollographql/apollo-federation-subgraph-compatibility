package com.example.demo.model

import com.expediagroup.graphql.generator.federation.directives.*
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeResolver
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component
import kotlin.math.roundToInt
import kotlin.properties.Delegates

/*
extend type User @key(fields: "email") {
  averageProductsCreatedPerYear: Int @requires(fields: "yearsOfEmployment")
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
    val email: String,
    @OverrideDirective(from = "users")
    val name: String,
    @ExternalDirective
    val totalProductsCreated: Int? = null
) {
    @ExternalDirective
    var yearsOfEmployment: Int by Delegates.notNull()

    @RequiresDirective(fields = FieldSet("yearsOfEmployment"))
    fun averageProductsCreatedPerYear(): Int? = if (totalProductsCreated != null) {
        (1.0f * totalProductsCreated / yearsOfEmployment).roundToInt()
    } else {
        null
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
            val user = User(email = email, name = "Jane Smith", totalProductsCreated = 1337)

            it["yearsOfEmployment"]?.toString()?.toIntOrNull()?.let { yearsOfEmployment ->
                user.yearsOfEmployment = yearsOfEmployment
            }
            user;
        }
    }
}
