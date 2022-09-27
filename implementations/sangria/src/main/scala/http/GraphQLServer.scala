package http

import cats.data.NonEmptyList
import cats.effect.{IO, ResourceIO}
import com.comcast.ip4s.{Host, Port}
import io.circe.Json
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Server
import org.http4s.{Header, HttpRoutes}
import org.typelevel.ci.CIString
import sangria.execution.Middleware
import sangria.federation.tracing.ApolloFederationTracing

object GraphQLServer {

  private object `apollo-federation-include-trace` {
    val name: CIString = CIString("apollo-federation-include-trace")
    val header: Header.Raw = Header.Raw(name, "ftv1")
    val oneHeader: NonEmptyList[Header.Raw] = NonEmptyList.one(header)
  }

  def routes[Ctx](executor: GraphQLExecutor[Ctx]): HttpRoutes[IO] = {
    val dsl = new Http4sDsl[IO] {}
    import dsl._
    HttpRoutes.of[IO] { case req @ POST -> Root =>
      val tracing = req.headers
        .get(`apollo-federation-include-trace`.name)
        .contains(`apollo-federation-include-trace`.oneHeader)

      val middleware: List[Middleware[Ctx]] = if (tracing) ApolloFederationTracing :: Nil else Nil
      for {
        json <- req.as[Json]
        result <- IO.fromFuture(IO.delay(executor.query(json, middleware)))
        httpResult <- Ok(result)
      } yield httpResult
    }
  }

  def bind[Ctx](executor: GraphQLExecutor[Ctx], host: Host, port: Port): ResourceIO[Server] = {
    val httpApp = routes(executor).orNotFound

    EmberServerBuilder
      .default[IO]
      .withHost(host)
      .withPort(port)
      .withHttpApp(httpApp)
      .build
  }
}
