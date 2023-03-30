package models

import caliban.schema.{ ArgBuilder, Schema }

case class IDArgs(id: ID)

object IDArgs {
  implicit val schema: Schema[Any, IDArgs]    = Schema.gen
  implicit val argBuilder: ArgBuilder[IDArgs] = ArgBuilder.gen
}
