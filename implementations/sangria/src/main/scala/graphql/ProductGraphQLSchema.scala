package graphql

import graphql.UserGraphQLSchema.UserType
import io.circe.Json
import io.circe.generic.semiauto._
import model._
import sangria.federation.v2.Directives._
import sangria.federation.v2.{Decoder, EntityResolver}
import sangria.schema._

object ProductGraphQLSchema {
  private val ProductVariationType: ObjectType[Unit, ProductVariation] = ObjectType(
    "ProductVariation",
    fields = fields[Unit, ProductVariation](
      Field("id", IDType, resolve = _.value.id.value)
    )
  )

  private val ProductDimensionType: ObjectType[Unit, ProductDimension] = ObjectType(
    "ProductDimension",
    fields = fields[Unit, ProductDimension](
      Field("size", OptionType(StringType), resolve = _.value.size),
      Field("weight", OptionType(FloatType), resolve = _.value.weight),
      Field("unit", OptionType(StringType), resolve = _.value.unit, astDirectives = Vector(Inaccessible))
    )
  ).withDirective(Shareable)

  private val CaseStudyType: ObjectType[Unit, CaseStudy] = ObjectType(
    "CaseStudy",
    fields = fields[Unit, CaseStudy](
      Field("caseNumber", IDType, resolve = _.value.caseNumber.value),
      Field("description", OptionType(StringType), resolve = _.value.description)
    )
  )

  private val ProductResearchType: ObjectType[Unit, ProductResearch] = ObjectType(
    "ProductResearch",
    fields = fields[Unit, ProductResearch](
      Field("study", CaseStudyType, resolve = _.value.study),
      Field("outcome", OptionType(StringType), resolve = _.value.outcome)
    )
  ).withDirective(Key("study { caseNumber }"))

  private val ProductType: ObjectType[Unit, Product] = ObjectType(
    "Product",
    fields = fields[Unit, Product](
      Field("id", IDType, resolve = _.value.id.value),
      Field("sku", OptionType(StringType), resolve = _.value.sku),
      Field("package", OptionType(StringType), resolve = _.value.`package`),
      Field("variation", OptionType(ProductVariationType), resolve = _.value.variation),
      Field("dimensions", OptionType(ProductDimensionType), resolve = _.value.dimensions),
      Field(
        "createdBy",
        OptionType(UserType),
        resolve = _.value.createdBy,
        astDirectives = Vector(Provides("totalProductsCreated"))
      ),
      Field("notes", OptionType(StringType), resolve = _.value.notes, astDirectives = Vector(Tag("internal"))),
      Field("research", ListType(ProductResearchType), resolve = _.value.research)
    )
  ).withDirectives(
    Key("id"),
    Key("sku package"),
    Key("sku variation { id }")
  )

  private val DeprecatedProductType: ObjectType[Unit, DeprecatedProduct] = ObjectType(
    "DeprecatedProduct",
    fields = fields[Unit, DeprecatedProduct](
      Field("sku", StringType, resolve = _.value.sku),
      Field("package", StringType, resolve = _.value.`package`),
      Field("reason", OptionType(StringType), resolve = _.value.reason),
      Field("createdBy", OptionType(UserType), resolve = _.value.createdBy)
    )
  ).withDirective(Key("sku package"))

  val IdArg: Argument[String] = Argument("id", IDType)
  val SkuArg: Argument[String] = Argument("sku", StringType)
  val PackageArg: Argument[String] = Argument("package", StringType)

  val productQueryField: Field[AppContext, Unit] = Field(
    "product",
    OptionType(ProductType),
    arguments = List(IdArg),
    resolve = ctx => ctx.ctx.productService.product(ID(ctx.arg(IdArg)))
  )

  val deprecatedProductQueryField: Field[AppContext, Unit] = Field(
    name = "deprecatedProduct",
    fieldType = OptionType(DeprecatedProductType),
    deprecationReason = Some("Use product query instead"),
    arguments = List(SkuArg, PackageArg),
    resolve = ctx => ctx.ctx.productService.deprecatedProduct(ctx.arg(SkuArg), ctx.arg(PackageArg))
  )

  case class DeprecatedProductArgs(sku: String, `package`: String)
  object DeprecatedProductArgs {
    val jsonDecoder: io.circe.Decoder[DeprecatedProductArgs] = deriveDecoder[DeprecatedProductArgs]
    implicit val decoder: Decoder[Json, DeprecatedProductArgs] = jsonDecoder.decodeJson
  }

  case class CaseStudyArgs(caseNumber: ID)
  object CaseStudyArgs {
    implicit val jsonDecoder: io.circe.Decoder[CaseStudyArgs] = deriveDecoder[CaseStudyArgs]
  }

  case class ProductResearchArgs(study: CaseStudyArgs)
  object ProductResearchArgs {
    val jsonDecoder: io.circe.Decoder[ProductResearchArgs] = deriveDecoder[ProductResearchArgs]
    implicit val decoder: Decoder[Json, ProductResearchArgs] = jsonDecoder.decodeJson
  }

  sealed trait ProductArgs

  object ProductArgs {
    import cats.syntax.functor._

    case class IdOnly(id: ID) extends ProductArgs
    object IdOnly {
      implicit val jsonDecoder: io.circe.Decoder[IdOnly] = deriveDecoder[IdOnly]
    }

    case class SkuAndPackage(sku: String, `package`: String) extends ProductArgs
    object SkuAndPackage {
      implicit val jsonDecoder: io.circe.Decoder[SkuAndPackage] = deriveDecoder[SkuAndPackage]
    }

    case class SkuAndVariationId(sku: String, variation: ProductVariation) extends ProductArgs
    object SkuAndVariationId {
      implicit val jsonDecoder: io.circe.Decoder[SkuAndVariationId] = deriveDecoder[SkuAndVariationId]
    }

    val jsonDecoder: io.circe.Decoder[ProductArgs] = List[io.circe.Decoder[ProductArgs]](
      io.circe.Decoder[IdOnly].widen,
      io.circe.Decoder[SkuAndPackage].widen,
      io.circe.Decoder[SkuAndVariationId].widen
    ).reduceLeft(_ or _)
    implicit val decoder: Decoder[Json, ProductArgs] = jsonDecoder.decodeJson
  }

  implicit val decoder: Decoder[Json, ID] = ID.decoder.decodeJson

  def productResearchResolver: EntityResolver[AppContext, Json] { type Arg = ProductResearchArgs } =
    EntityResolver[AppContext, Json, ProductResearch, ProductResearchArgs](
      ProductResearchType.name,
      (arg, ctx) => ctx.ctx.productResearchService.productResearch(arg.study.caseNumber)
    )

  def productResolver: EntityResolver[AppContext, Json] { type Arg = ProductArgs } =
    EntityResolver[AppContext, Json, Product, ProductArgs](
      ProductType.name,
      (arg, ctx) =>
        arg match {
          case ProductArgs.IdOnly(id)               => ctx.ctx.productService.product(id)
          case ProductArgs.SkuAndPackage(sku, pack) => ctx.ctx.productService.bySkuAndPackage(sku, pack)
          case ProductArgs.SkuAndVariationId(sku, variation) =>
            ctx.ctx.productService.bySkuAndProductVariantionId(sku, variation)
        }
    )

  def deprecatedProductResolver: EntityResolver[AppContext, Json] { type Arg = DeprecatedProductArgs } =
    EntityResolver[AppContext, Json, DeprecatedProduct, DeprecatedProductArgs](
      DeprecatedProductType.name,
      (arg, ctx) => ctx.ctx.productService.deprecatedProduct(arg.sku, arg.`package`)
    )
}
