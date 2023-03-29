package models

import caliban.InputValue
import caliban.schema.{ ArgBuilder, Schema }

sealed trait ProductArgs

object ProductArgs {
  case class IdOnly(id: ID)                                              extends ProductArgs
  case class SkuAndPackage(sku: String, `package`: String)               extends ProductArgs
  case class SkuAndVariationId(sku: String, variation: ProductVariation) extends ProductArgs

  val idOnlyArgBuilder: ArgBuilder[IdOnly]                       = ArgBuilder.gen[IdOnly]
  val skuAndPackageArgBuilder: ArgBuilder[SkuAndPackage]         = ArgBuilder.gen[SkuAndPackage]
  val skuAndVariationIdArgBuilder: ArgBuilder[SkuAndVariationId] = ArgBuilder.gen[SkuAndVariationId]

  implicit val argBuilder: ArgBuilder[ProductArgs] = (input: InputValue) =>
    (for {
      error <- skuAndVariationIdArgBuilder.build(input).swap
      _     <- skuAndPackageArgBuilder.build(input).swap
      _     <- idOnlyArgBuilder.build(input).swap
    } yield error).swap

  implicit val schema: Schema[Any, ProductArgs] = Schema.gen

}
