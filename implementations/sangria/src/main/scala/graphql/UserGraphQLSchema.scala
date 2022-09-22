package graphql

import graphql.Directives.{External, Override, Requires}
import io.circe.Json
import model.{ID, User}
import sangria.federation.v2.{Decoder, EntityResolver}
import sangria.federation.v2.Directives.Key
import sangria.schema._
import service.UserService

object UserGraphQLSchema {
  // should be "extend", but according to the spec, an extend type can only exist if there is one type:
  // http://spec.graphql.org/draft/#sec-Object-Extensions.Type-Validation
  val UserType: ObjectType[Unit, User] = ObjectType(
    "User",
    fields = fields[Unit, User](
      External(Field("email", IDType, resolve = _.value.email.value)),
      Override("users")(Field("name", OptionType(StringType), resolve = _.value.name)),
      External(Field("yearsOfEmployment", IntType, resolve = _.value.yearsOfEmployment)),
      External(Field("totalProductsCreated", OptionType(IntType), resolve = _.value.totalProductsCreated)),
      Requires("totalProductsCreated yearsOfEmployment")(
        Field("averageProductsCreatedPerYear", OptionType(IntType), resolve = _.value.averageProductsCreatedPerYear)
      )
    )
  ).copy(astDirectives = Vector(Key("email")))

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
