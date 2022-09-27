package http

import io.circe.Json
import sangria.execution.WithViolations
import sangria.parser.SyntaxError
import sangria.validation.AstNodeViolation

object GraphQLError {
  def apply(s: String): Json = Json.obj(
    "errors" -> Json.arr(
      Json.obj("message" -> Json.fromString(s))
    )
  )

  def apply(e: SyntaxError): Json = Json.obj(
    "errors" -> Json.arr(
      Json.obj(
        "message" -> Json.fromString(e.getMessage),
        "locations" -> Json.arr(
          Json.obj(
            "line" -> Json.fromInt(e.originalError.position.line),
            "column" -> Json.fromInt(e.originalError.position.column)
          )
        )
      )
    )
  )

  def apply(e: WithViolations): Json =
    Json.obj("errors" -> Json.fromValues(e.violations.map {
      case v: AstNodeViolation =>
        Json.obj(
          "message" -> Json.fromString(v.errorMessage),
          "locations" -> Json.fromValues(
            v.locations.map(loc => Json.obj("line" -> Json.fromInt(loc.line), "column" -> Json.fromInt(loc.column)))
          )
        )
      case v => Json.obj("message" -> Json.fromString(v.errorMessage))
    }))
}
