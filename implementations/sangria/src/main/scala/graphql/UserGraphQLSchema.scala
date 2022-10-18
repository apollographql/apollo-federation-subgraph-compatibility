package graphql

import io.circe.Json
import model.{ID, User}
import sangria.federation.v2.Directives._
import sangria.federation.v2.{Decoder, EntityResolver}
import sangria.schema._

object UserGraphQLSchema {
  // should be "extend", but according to the spec, an extend type can only exist if there is one type:
  // http://spec.graphql.org/draft/#sec-Object-Extensions.Type-Validation
  val UserType: ObjectType[Unit, User] = ObjectType(
    "User",
    fields = fields[Unit, User](
      Field("email", IDType, resolve = _.value.email.value, astDirectives = Vector(External)),
      Field("name", OptionType(StringType), resolve = _.value.name, astDirectives = Vector(Override("users"))),
      Field("yearsOfEmployment", IntType, resolve = _.value.yearsOfEmployment, astDirectives = Vector(External)),
      Field(
        "totalProductsCreated",
        OptionType(IntType),
        resolve = _.value.totalProductsCreated,
        astDirectives = Vector(External)
      ),
      Field(
        "averageProductsCreatedPerYear",
        OptionType(IntType),
        resolve = _.value.averageProductsCreatedPerYear,
        astDirectives = Vector(Requires("totalProductsCreated yearsOfEmployment"))
      )
    )
  ).withDirective(Key("email"))

  implicit val decoder: Decoder[Json, ID] = ID.decoder.decodeJson

  case class UserArgs(email: ID)
  object UserArgs {
    import io.circe.generic.semiauto._
    val jsonDecoder: io.circe.Decoder[UserArgs] = deriveDecoder[UserArgs]
    implicit val decoder: Decoder[Json, UserArgs] = jsonDecoder.decodeJson
  }

  def userResolver: EntityResolver[AppContext, Json] { type Arg = UserArgs } =
    EntityResolver[AppContext, Json, User, UserArgs](
      __typeName = UserType.name,
      (arg, ctx) => ctx.ctx.userService.user(arg.email)
    )
}
