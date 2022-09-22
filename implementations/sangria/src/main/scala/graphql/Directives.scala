package graphql

import sangria.ast
import sangria.schema.{Field, ObjectType}

import scala.reflect.ClassTag

// TODO: move to sangria-federated

object Directives {

  object Inaccessible {
    val directive: ast.Directive = ast.Directive(
      name = "inaccessible",
      arguments = Vector.empty
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)
  }

  object External {
    val directive: ast.Directive = ast.Directive(
      name = "external",
      arguments = Vector.empty
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)
  }

  object Shareable {
    val directive: ast.Directive = ast.Directive(
      name = "shareable",
      arguments = Vector.empty
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)

    def apply[Ctx, Val: ClassTag](obj: ObjectType[Ctx, Val]): ObjectType[Ctx, Val] =
      obj.copy(astDirectives = obj.astDirectives :+ directive)
  }

  case class Override(from: String) {
    val directive: ast.Directive = ast.Directive(
      name = "override",
      arguments = Vector(ast.Argument(name = "from", value = ast.StringValue(from)))
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)
  }

  case class Requires(fields: String) {
    val directive: ast.Directive = ast.Directive(
      name = "requires",
      arguments = Vector(ast.Argument(name = "fields", value = ast.StringValue(fields)))
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)
  }

  case class Provides(fields: String) {
    val directive: ast.Directive = ast.Directive(
      name = "provides",
      arguments = Vector(ast.Argument(name = "fields", value = ast.StringValue(fields)))
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)
  }

  case class Tag(name: String) {
    val directive: ast.Directive = ast.Directive(
      name = "tag",
      arguments = Vector(ast.Argument(name = "name", value = ast.StringValue(name)))
    )

    def apply[Ctx, Val](field: Field[Ctx, Val]): Field[Ctx, Val] =
      field.copy(astDirectives = field.astDirectives :+ directive)
  }
}
