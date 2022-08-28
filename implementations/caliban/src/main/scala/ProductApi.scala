import caliban.Value.StringValue
import caliban.federation.EntityResolver
import caliban.federation.tracing.ApolloFederatedTracing
import caliban.federation.v2._
import caliban.schema.Annotations.GQLDeprecated
import caliban.schema.Schema.scalarSchema
import caliban.schema.{ ArgBuilder, GenericSchema, Schema }
import caliban._
import zio.query.ZQuery
import zio.{ IO, URIO, ZIO }

case class ID(id: String) extends AnyVal

object ID {
  implicit val schema: Schema[Any, ID] = scalarSchema[ID]("ID", None, None, id => StringValue(id.id))
}

@GQLKey(fields = "email")
@GQLExtend
case class User(
  @GQLExternal email: ID,
  @GQLExternal totalProductsCreated: Option[Int],
  @GQLOverride("users") name: Option[String],
  @GQLRequires("totalProductsCreated yearsOfEmployment") averageProductsCreatedPerYear: Option[Int],
  @GQLExternal yearsOfEmployment: Int
)

@GQLKey(fields = "id")
@GQLKey(fields = "sku package")
@GQLKey(fields = "sku variation { id }")
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

@GQLShareable
case class ProductDimension(size: Option[String], weight: Option[Float], @GQLInaccessible unit: Option[String])
case class ProductVariation(id: ID)

@GQLKey("study { caseNumber }")
case class ProductResearch(
  study: CaseStudy,
  outcome: Option[String]
)

case class CaseStudy(
  caseNumber: ID,
  description: Option[String]
)

@GQLKey("sku package")
case class DeprecatedProduct(
  sku: String,
  `package`: String,
  reason: Option[String],
  createdBy: URIO[UserService, Option[User]]
)

object ProductApi extends GenericSchema[ProductService with UserService] {

  case class IDArgs(id: ID)

  case class DeprecatedProductArgs(sku: String, `package`: String)

  case class UserArgs(email: ID)

  case class CaseStudyArgs(caseNumber: ID)

  case class ProductResearchArgs(study: CaseStudyArgs)

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

  }

  implicit val productSchema           = gen[ProductService with UserService, Product]
  implicit val userSchema              = gen[ProductService with UserService, User]
  implicit val deprecatedProductSchema = gen[ProductService with UserService, DeprecatedProduct]

  val productResolver: EntityResolver[ProductService with UserService] =
    EntityResolver[ProductService with UserService, ProductArgs, Product] {
      case ProductArgs.IdOnly(id)                        =>
        ZQuery.serviceWithZIO[ProductService](_.getProductById(id.id))
      case ProductArgs.SkuAndPackage(sku, p)             =>
        ZQuery.serviceWithZIO[ProductService](_.getProductBySkuAndPackage(sku, p))
      case ProductArgs.SkuAndVariationId(sku, variation) =>
        ZQuery.serviceWithZIO[ProductService](_.getProductBySkuAndVariationId(sku, variation.id.id))
    }

  val userResolver: EntityResolver[UserService with ProductService] =
    EntityResolver[UserService with ProductService, UserArgs, User] { args =>
      ZQuery.serviceWithZIO[UserService](_.getUser)
    }

  val productResearchResolver: EntityResolver[UserService with ProductService] =
    EntityResolver.from[ProductResearchArgs] { args =>
      ZQuery.some(
        ProductResearch(
          CaseStudy(caseNumber = args.study.caseNumber, Some("Federation Study")),
          None
        )
      )
    }

  val deprecatedProductResolver: EntityResolver[ProductService with UserService] =
    EntityResolver[ProductService with UserService, DeprecatedProductArgs, DeprecatedProduct] { args =>
      ZQuery.some(
        DeprecatedProduct(
          sku = "apollo-federation-v1",
          `package` = "@apollo/federation-v1",
          reason = Some("Migrate to Federation V2"),
          createdBy = ZIO.serviceWithZIO[UserService](_.getUser)
        )
      )
    }

  case class Query(
    product: IDArgs => URIO[ProductService, Option[Product]],
    @GQLDeprecated("Use product query instead") deprecatedProduct: DeprecatedProductArgs => URIO[
      ProductService,
      Option[DeprecatedProduct]
    ]
  )

  val graphql: GraphQL[ProductService with UserService] =
    GraphQL.graphQL(
      RootResolver(
        Query(
          args => ZIO.serviceWithZIO[ProductService](_.getProductById(args.id.id)),
          args =>
            ZIO.some(
              DeprecatedProduct(
                sku = "apollo-federation-v1",
                `package` = "@apollo/federation-v1",
                reason = Some("Migrate to Federation V2"),
                createdBy = ZIO.serviceWithZIO[UserService](_.getUser)
              )
            )
        )
      )
    ) @@ federated(
      productResolver,
      userResolver,
      productResearchResolver,
      deprecatedProductResolver
    ) @@ ApolloFederatedTracing.wrapper

  val interpreter: IO[CalibanError.ValidationError, GraphQLInterpreter[ProductService with UserService, CalibanError]] =
    graphql.interpreter

}
