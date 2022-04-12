import zio.{ Ref, UIO }

trait ProductService {
  def getProductById(id: String): UIO[Option[Product]]
  def getProductBySkuAndPackage(sku: String, pack: String): UIO[Option[Product]]
  def getProductBySkuAndVariationId(sku: String, variationId: String): UIO[Option[Product]]
}

object ProductService {
  val inMemory =
    Ref
      .make(
        List(
          Product(
            id = ID("apollo-federation"),
            sku = Some("federation"),
            `package` = Some("@apollo/federation"),
            variation = Some(ProductVariation(ID("OSS"))),
            dimensions = Some(ProductDimension(Some("small"), Some(1.0f))),
            createdBy = Some(User(ID("support@apollographql.com"), Some(1337)))
          ),
          Product(
            id = ID("apollo-studio"),
            sku = Some("studio"),
            `package` = Some(""),
            variation = Some(ProductVariation(ID("platform"))),
            dimensions = Some(ProductDimension(Some("small"), Some(1.0f))),
            createdBy = Some(User(ID("support@apollographql.com"), Some(1337)))
          )
        )
      )
      .map { products =>
        new ProductService {
          override def getProductById(id: String): UIO[Option[Product]] =
            products.get.map(_.find(_.id.id == id))

          override def getProductBySkuAndPackage(sku: String, pack: String): UIO[Option[Product]] =
            products.get.map(_.find(p => p.sku.contains(sku) && p.`package`.contains(pack)))

          override def getProductBySkuAndVariationId(sku: String, variationId: String): UIO[Option[Product]] =
            products.get.map(
              _.find(p => p.sku.contains(sku) && p.variation.contains(ProductVariation(ID(variationId))))
            )
        }
      }
      .toLayer
}
