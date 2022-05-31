import caliban.Value.StringValue
import caliban.federation.EntityResolver
import caliban.federation.v2._
import caliban.federation.tracing.ApolloFederatedTracing
import caliban.schema.Schema.scalarSchema
import caliban.schema.{ ArgBuilder, GenericSchema, Schema }
import caliban.{ CalibanError, GraphQL, GraphQLInterpreter, InputValue, RootResolver }
import zio.clock.Clock
import zio.query.ZQuery
import zio.{ Has, IO, URIO, ZIO }

case class ID(id: String) extends AnyVal

object ID {
  implicit val schema: Schema[Any, ID] = scalarSchema[ID]("ID", None, None, id => StringValue(id.id))
}

@GQLKey(fields = "email")
@GQLExtend
case class User(
  @GQLExternal email: ID,
  @GQLExternal totalProductsCreated: Option[Int],
  @GQLOverride("users") name: Option[String]
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
  @GQLProvides(fields = "totalProductsCreated") createdBy: Option[User],
  @GQLTag("internal") notes: Option[String]
)

@GQLShareable
case class ProductDimension(size: Option[String], weight: Option[Float], @GQLInaccessible unit: Option[String])
case class ProductVariation(id: ID)

object ProductApi extends GenericSchema[Has[ProductService]] {

  case class IDArgs(id: ID)

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

  val productResolver = EntityResolver.from[ProductArgs] {
    case ProductArgs.IdOnly(id)                        =>
      ZQuery.fromEffect(ZIO.serviceWith[ProductService](_.getProductById(id.id)))
    case ProductArgs.SkuAndPackage(sku, p)             =>
      ZQuery.fromEffect(ZIO.serviceWith[ProductService](_.getProductBySkuAndPackage(sku, p)))
    case ProductArgs.SkuAndVariationId(sku, variation) =>
      ZQuery.fromEffect(ZIO.serviceWith[ProductService](_.getProductBySkuAndVariationId(sku, variation.id.id)))

  }

  case class Query(
    product: IDArgs => URIO[Has[ProductService], Option[Product]]
  )

  val graphql: GraphQL[Clock with Has[ProductService]] =
    GraphQL.graphQL(
      RootResolver(
        Query(args => ZIO.serviceWith[ProductService](_.getProductById(args.id.id)))
      )
    ) @@ federated(productResolver) @@ ApolloFederatedTracing.wrapper

  val interpreter: IO[CalibanError.ValidationError, GraphQLInterpreter[Clock with Has[ProductService], CalibanError]] =
    graphql.interpreter

}
