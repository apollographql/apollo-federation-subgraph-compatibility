import zio.{ Ref, UIO, ZIO, ZLayer }

trait ProductService {
  def getProductById(id: String): UIO[Option[Product]]
  def getProductBySkuAndPackage(sku: String, pack: String): UIO[Option[Product]]
  def getProductBySkuAndVariationId(sku: String, variationId: String): UIO[Option[Product]]
}

object ProductService {
//  const productsResearch =
//  [
//  {
//    study: {
//      caseNumber: "1234",
//      description: "Federation Study"
//    }
//    ,
//    outcome: null
//  }
//  ,
//  {
//    study: {
//      caseNumber: "1235",
//      description: "Studio Study"
//    }
//    ,
//    outcome: null
//  }
//  ,
//  ]

  val productsResearch = List(
    ProductResearch(
      study = CaseStudy(ID("1234"), Some("Federation Study")),
      outcome = None
    ),
    ProductResearch(
      study = CaseStudy(ID("1235"), Some("Studio Study")),
      outcome = None
    )
  )

  val inMemory: ZLayer[Any, Nothing, ProductService] =
    ZLayer(
      Ref
        .make(
          List(
            Product(
              id = ID("apollo-federation"),
              sku = Some("federation"),
              `package` = Some("@apollo/federation"),
              variation = Some(ProductVariation(ID("OSS"))),
              dimensions = Some(ProductDimension(Some("small"), Some(1.0f), Some("kg"))),
              createdBy = ZIO.some(
                User(
                  ID("support@apollographql.com"),
                  Some(1337),
                  Some("Jane Smith"),
                  averageProductsCreatedPerYear = Some(1337 / 10),
                  yearsOfEmployment = 10
                )
              ),
              notes = Some("This is a test product"),
              research = productsResearch.init
            ),
            Product(
              id = ID("apollo-studio"),
              sku = Some("studio"),
              `package` = Some(""),
              variation = Some(ProductVariation(ID("platform"))),
              dimensions = Some(ProductDimension(Some("small"), Some(1.0f), Some("kg"))),
              createdBy = ZIO.some(
                User(
                  ID("support@apollographql.com"),
                  Some(1337),
                  Some("Jane Smith"),
                  averageProductsCreatedPerYear = Some(1337 / 10),
                  yearsOfEmployment = 10
                )
              ),
              notes = Some("This is a note"),
              research = productsResearch.tail
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
    )
}
