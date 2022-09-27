package service

import model._
import service.UserService.user

import scala.concurrent.Future

trait ProductService {
  def product(id: ID): Future[Option[Product]]
  def bySkuAndPackage(sku: String, `package`: String): Future[Option[Product]]
  def bySkuAndProductVariantionId(sku: String, variation: ProductVariation): Future[Option[Product]]
  def deprecatedProduct(sku: String, `package`: String): Future[Option[DeprecatedProduct]]
}

object ProductService {
  private val dimension = ProductDimension(Some("small"), Some(1.0f), Some("kg"))

  private val deprecatedProduct = DeprecatedProduct(
    sku = "apollo-federation-v1",
    `package` = "@apollo/federation-v1",
    reason = Some("Migrate to Federation V2"),
    createdBy = Some(user)
  )

  private val product1 = Product(
    id = ID("apollo-federation"),
    sku = Some("federation"),
    `package` = Some("@apollo/federation"),
    variation = Some(ProductVariation(ID("OSS"))),
    dimensions = Some(dimension),
    research = List(ProductResearch(CaseStudy(ID("1234"), Some("Federation Study")))),
    createdBy = Some(user)
  )

  private val product2 = Product(
    id = ID("apollo-studio"),
    sku = Some("studio"),
    `package` = Some(""),
    variation = Some(ProductVariation(ID("platform"))),
    dimensions = Some(dimension),
    research = List(ProductResearch(CaseStudy(ID("1235"), Some("Studio Study")))),
    createdBy = Some(user)
  )

  private val products: List[Product] = List(product1, product2)
  private val deprecatedProducts: List[DeprecatedProduct] = List(deprecatedProduct)

  val inMemory: ProductService = new ProductService {
    override def product(id: ID): Future[Option[Product]] =
      Future.successful(products.find(_.id == id))

    override def bySkuAndPackage(sku: String, `package`: String): Future[Option[Product]] =
      Future.successful(products.find { p => p.sku.contains(sku) && p.`package`.contains(`package`) })

    override def bySkuAndProductVariantionId(sku: String, variation: ProductVariation): Future[Option[Product]] =
      Future.successful(products.find { p =>
        p.sku.contains(sku) &&
        p.variation.exists(_.id == variation.id)
      })

    override def deprecatedProduct(sku: String, `package`: String): Future[Option[DeprecatedProduct]] =
      Future.successful(deprecatedProducts.find(p => p.sku == sku && p.`package` == `package`))
  }
}
