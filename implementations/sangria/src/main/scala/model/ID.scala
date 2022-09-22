package model

import io.circe.Decoder

case class ID(value: String) extends AnyVal

object ID {
  implicit val decoder: Decoder[ID] = Decoder.decodeString.map(ID.apply)
}
