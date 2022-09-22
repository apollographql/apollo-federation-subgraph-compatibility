package model

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class ProductVariation(id: ID)
object ProductVariation {
  implicit val jsonDecoder: Decoder[ProductVariation] = deriveDecoder[ProductVariation]
}

case class ProductDimension(size: Option[String], weight: Option[Double], unit: Option[String])

case class CaseStudy(
    caseNumber: ID,
    description: Option[String]
)

case class ProductResearch(
    study: CaseStudy,
    outcome: Option[String] = None
)

case class Product(
    id: ID,
    sku: Option[String],
    `package`: Option[String],
    variation: Option[ProductVariation],
    dimensions: Option[ProductDimension],
    createdBy: Option[User],
    research: List[ProductResearch],
    notes: Option[String] = None
)

case class DeprecatedProduct(
    sku: String,
    `package`: String,
    reason: Option[String],
    createdBy: Option[User]
)
