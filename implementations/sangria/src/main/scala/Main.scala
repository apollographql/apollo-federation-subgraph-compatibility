import cats.effect.{ExitCode, IO, IOApp}
import com.comcast.ip4s.IpLiteralSyntax
import graphql.{AppContext, GraphQLSchema, ProductGraphQLSchema, UserGraphQLSchema}
import http.{GraphQLExecutor, GraphQLServer}
import io.circe.Json
import sangria.federation.v2.Federation
import sangria.marshalling.InputUnmarshaller
import sangria.renderer.QueryRenderer
import sangria.schema.Schema
import service.{ProductResearchService, ProductService, UserService}

object Main extends IOApp {

  override def run(args: List[String]): IO[ExitCode] = (args match {
    case "printSchema" :: Nil => printSchema
    case _                    => runGraphQLServer
  }).as(ExitCode.Success)

  private def printSchema: IO[Unit] =
    for {
      schema <- IO(schemaAndUm).map(_._1)
      _ <- IO.println(QueryRenderer.renderPretty(schema.toAst))
    } yield ()

  private def runGraphQLServer: IO[Unit] =
    for {
      ctx <- appContext
      executor <- graphQLExecutor(ctx)
      host = host"0.0.0.0"
      port = port"4001"
      _ <- IO.println(s"starting GraphQL HTTP server on http://$host:$port")
      _ <- GraphQLServer.bind(executor, host, port).use(_ => IO.never)
    } yield ()

  private def appContext: IO[AppContext] = IO {
    new AppContext {
      override def productService: ProductService = ProductService.inMemory
      override def productResearchService: ProductResearchService = ProductResearchService.inMemory
      override def userService: UserService = UserService.inMemory
    }
  }

  private def schemaAndUm: (Schema[AppContext, Unit], InputUnmarshaller[Json]) =
    Federation.federate(
      GraphQLSchema.schema,
      sangria.marshalling.circe.CirceInputUnmarshaller,
      ProductGraphQLSchema.productResolver,
      ProductGraphQLSchema.deprecatedProductResolver,
      ProductGraphQLSchema.productResearchResolver,
      UserGraphQLSchema.userResolver
    )

  private def graphQLExecutor(context: AppContext): IO[GraphQLExecutor[AppContext]] = IO {
    val (schema, um) = schemaAndUm
    GraphQLExecutor(schema, context)(um)
  }
}
