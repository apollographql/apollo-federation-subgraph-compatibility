package graphql

import sangria.ast
import sangria.schema

object CustomDirectiveSpec {
  val CustomDirective: ast.Directive = ast.Directive("custom")
  val CustomDirectiveDefinition: schema.Directive =
    schema.Directive("custom", locations = Set(schema.DirectiveLocation.Object))
}
