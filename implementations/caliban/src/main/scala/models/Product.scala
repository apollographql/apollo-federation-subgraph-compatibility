package models

import caliban.parsing.adt.Directive
import caliban.schema.Annotations.GQLDirective
import caliban.schema.{ GenericSchema, Schema }
import services.UserService
import zio.URIO

@GQLKey(fields = "id")
@GQLKey(fields = "sku package")
@GQLKey(fields = "sku variation { id }")
@GQLDirective(Directive("custom"))
case class Product(
  id: ID,
  sku: Option[String],
  `package`: Option[String],
  variation: Option[ProductVariation],
  dimensions: Option[ProductDimension],
  @GQLProvides(fields = "totalProductsCreated") createdBy: URIO[UserService, Option[User]],
  @GQLTag("internal") notes: Option[String],
  research: List[ProductResearch]
)

object Product {
  private object genSchema extends GenericSchema[UserService]
  implicit val schema: Schema[UserService, Product] = genSchema.gen
}
