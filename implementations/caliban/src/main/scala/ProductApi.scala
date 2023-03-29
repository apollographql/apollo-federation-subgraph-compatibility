import caliban.Value.StringValue
import caliban.federation.EntityResolver
import caliban.federation.tracing.ApolloFederatedTracing
import caliban.schema.Annotations.{ GQLDeprecated, GQLDirective }
import caliban.schema.Schema.scalarSchema
import caliban.schema.{ ArgBuilder, GenericSchema, Schema }
import caliban._
import caliban.federation.v2x.{ ComposeDirective, FederationDirectivesV2_3, FederationV2, Import, Link, Versions }
import caliban.parsing.adt.Directive
import caliban.introspection.adt.{ __Directive, __DirectiveLocation }
import zio.query.ZQuery
import zio.{ IO, URIO, ZIO }

object myFederation
    extends FederationV2(
      Versions.v2_3 :: List(
        Link("https://myspecs.dev/myCustomDirective/v1.0", List(Import("@custom"))),
        ComposeDirective("@custom")
      )
    )
    with FederationDirectivesV2_3

import myFederation._

case class ID(id: String) extends AnyVal

object ID {
  implicit val schema: Schema[Any, ID]    = scalarSchema[ID]("ID", None, None, id => StringValue(id.id))
  implicit val argBuilder: ArgBuilder[ID] = ArgBuilder.string.map(ID(_))
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

object User {
  implicit val schema: Schema[Any, User] = Schema.gen
}

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

@GQLShareable
case class ProductDimension(size: Option[String], weight: Option[Float], @GQLInaccessible unit: Option[String])

object ProductDimension {
  implicit val schema: Schema[Any, ProductDimension] = Schema.gen
}

case class ProductVariation(id: ID)

object ProductVariation {
  implicit val schema: Schema[Any, ProductVariation]    = Schema.gen
  implicit val argBuilder: ArgBuilder[ProductVariation] =
    ArgBuilder.gen
}

@GQLKey("study { caseNumber }")
case class ProductResearch(
  study: CaseStudy,
  outcome: Option[String]
)

object ProductResearch {
  implicit val schema: Schema[Any, ProductResearch] = Schema.gen
}

case class CaseStudy(
  caseNumber: ID,
  description: Option[String]
)

object CaseStudy {
  implicit val schema: Schema[Any, CaseStudy] = Schema.gen
}

@GQLKey("sku package")
case class DeprecatedProduct(
  sku: String,
  `package`: String,
  reason: Option[String],
  createdBy: URIO[UserService, Option[User]]
)

object DeprecatedProduct {
  object genSchema extends GenericSchema[UserService]
  implicit val schema: Schema[UserService, DeprecatedProduct] = genSchema.gen
}

@GQLInterfaceObject
@GQLKey("email")
case class Inventory(
  id: ID,
  deprecatedProducts: List[DeprecatedProduct]
)

object Inventory {
  object genSchema extends GenericSchema[InventoryService with UserService]
  implicit val schema: Schema[InventoryService with UserService, Inventory] = genSchema.gen
}

case class IDArgs(id: ID)

object IDArgs {
  implicit val schema: Schema[Any, IDArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[IDArgs] = ArgBuilder.gen
}

case class DeprecatedProductArgs(sku: String, `package`: String)

object DeprecatedProductArgs {
  implicit val schema: Schema[Any, DeprecatedProductArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[DeprecatedProductArgs] = ArgBuilder.gen
}

case class UserArgs(email: ID)

object UserArgs {
  implicit val schema: Schema[Any, UserArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[UserArgs] = ArgBuilder.gen
}

case class CaseStudyArgs(caseNumber: ID)

object CaseStudyArgs {
  implicit val schema: Schema[Any, CaseStudyArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[CaseStudyArgs] = ArgBuilder.gen
}

case class ProductResearchArgs(study: CaseStudyArgs)

object ProductResearchArgs {
  implicit val schema: Schema[Any, ProductResearchArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[ProductResearchArgs] = ArgBuilder.gen
}

case class InventoryArgs(id: ID)

object InventoryArgs {
  implicit val schema: Schema[Any, InventoryArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[InventoryArgs] = ArgBuilder.gen
}

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

object ProductApi extends GenericSchema[ProductService with UserService] {
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

  val inventoryResolver: EntityResolver[InventoryService with UserService] =
    EntityResolver[InventoryService with UserService, InventoryArgs, Inventory] { args =>
      ZQuery.serviceWith[InventoryService](_.getById(args.id.id))
    }

  case class Query(
    product: IDArgs => URIO[ProductService, Option[Product]],
    @GQLDeprecated("Use product query instead") deprecatedProduct: DeprecatedProductArgs => URIO[
      ProductService,
      Option[DeprecatedProduct]
    ]
  )

  object Query {
    implicit val schema: Schema[ProductService with UserService, Query] = gen
  }

  val graphql: GraphQL[ProductService with UserService with InventoryService] =
    graphQL(
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
      ),
      directives = List(
        __Directive(
          "custom",
          None,
          Set(__DirectiveLocation.OBJECT),
          Nil,
          repeatable = false
        )
      )
    ) @@ federated(
      productResolver,
      userResolver,
      productResearchResolver,
      deprecatedProductResolver,
      inventoryResolver
    ) @@ ApolloFederatedTracing.wrapper

  val interpreter: IO[CalibanError.ValidationError, GraphQLInterpreter[
    ProductService with UserService with InventoryService,
    CalibanError
  ]] =
    graphql.interpreter

}
