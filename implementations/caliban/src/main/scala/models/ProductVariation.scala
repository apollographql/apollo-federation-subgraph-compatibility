package models

import caliban.schema.{ ArgBuilder, Schema }

case class ProductVariation(id: ID)

object ProductVariation {
  implicit val schema: Schema[Any, ProductVariation]    = Schema.gen
  implicit val argBuilder: ArgBuilder[ProductVariation] = ArgBuilder.gen
}
