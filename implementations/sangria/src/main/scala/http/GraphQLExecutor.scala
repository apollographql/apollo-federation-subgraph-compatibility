package http

import io.circe.optics.JsonPath.root
import io.circe.{Json, JsonObject}
import sangria.ast
import sangria.execution.{Executor, Middleware}
import sangria.marshalling.InputUnmarshaller
import sangria.marshalling.circe.CirceResultMarshaller
import sangria.parser.{QueryParser, SyntaxError}
import sangria.schema.Schema

import scala.concurrent.ExecutionContext.Implicits._
import scala.concurrent.Future
import scala.util.{Failure, Success}

trait GraphQLExecutor[Ctx] {
  def query(request: Json, middleware: List[Middleware[Ctx]]): Future[Json]
}

object GraphQLExecutor {
  private val queryStringLens = root.query.string
  private val operationNameLens = root.operationName.string
  private val variablesLens = root.variables.obj

  def apply[Ctx](schema: Schema[Ctx, Unit], context: Ctx)(implicit um: InputUnmarshaller[Json]): GraphQLExecutor[Ctx] =
    new GraphQLExecutor[Ctx] {
      override def query(request: Json, middleware: List[Middleware[Ctx]]): Future[Json] = {
        val queryString = queryStringLens.getOption(request)
        val operationName = operationNameLens.getOption(request)
        val variables =
          Json.fromJsonObject(variablesLens.getOption(request).getOrElse(JsonObject.empty))

        queryString match {
          case Some(qs) => query(qs, operationName, variables, middleware)
          case None     => Future.successful(GraphQLError("No 'query' property was present in the request."))
        }
      }

      private def query(
          query: String,
          operationName: Option[String],
          variables: Json,
          middleware: List[Middleware[Ctx]]
      ): Future[Json] =
        QueryParser.parse(query) match {
          case Success(ast)            => exec(ast, operationName, variables, middleware)
          case Failure(e: SyntaxError) => Future.successful(http.GraphQLError(e))
          case Failure(e)              => Future.failed(e)
        }

      private def exec(
          query: ast.Document,
          operationName: Option[String],
          variables: Json,
          middleware: List[Middleware[Ctx]]
      ): Future[Json] =
        Executor.execute(
          schema = schema,
          queryAst = query,
          userContext = context,
          variables = variables,
          operationName = operationName,
          middleware = middleware
        )
    }
}
