package graphql

import graphql.InventoryGraphQLSchema.InventoryType
import graphql.ProductGraphQLSchema.{deprecatedProductQueryField, productQueryField}
import graphql.UserGraphQLSchema.UserType
import sangria.schema._

object GraphQLSchema {
  private val QueryType: ObjectType[AppContext, Unit] =
    ObjectType(
      name = "Query",
      fieldsFn = () =>
        fields[AppContext, Unit](
          productQueryField,
          deprecatedProductQueryField
        )
    )

  val schema: Schema[AppContext, Unit] = Schema(
    query = QueryType,
    mutation = None,
    additionalTypes = List(UserType, InventoryType)
  )
}
