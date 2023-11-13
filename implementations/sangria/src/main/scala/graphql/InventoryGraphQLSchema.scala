package graphql

import io.circe.Json
import model.{ID, Inventory}
import graphql.ProductGraphQLSchema.DeprecatedProductType
import io.circe.generic.semiauto.deriveDecoder
import sangria.federation.v2.Directives.{InterfaceObject, Key}
import sangria.federation.v2.{Decoder, EntityResolver}
import sangria.schema._

object InventoryGraphQLSchema {
  val InventoryType: ObjectType[Unit, Inventory] = ObjectType(
    "Inventory",
    fields = fields[Unit, Inventory](
      Field("id", IDType, resolve = _.value.id.value),
      Field(
        "deprecatedProducts",
        ListType(DeprecatedProductType),
        resolve = _.value.deprecatedProducts
      )
    )
  ).withDirectives(Key("id"), InterfaceObject)

  case class InventoryArgs(id: ID)

  val jsonDecoder: io.circe.Decoder[InventoryArgs] = deriveDecoder[InventoryArgs]
  val decoder: Decoder[Json, InventoryArgs] = jsonDecoder.decodeJson

  def inventoryResolver: EntityResolver[AppContext, Json] {type Arg = InventoryArgs} =
    EntityResolver[AppContext, Json, Inventory, InventoryArgs](
      __typeName = InventoryType.name,
      (arg, ctx) => ctx.ctx.productService.inventory(arg.id)
    )(decoder)
}
