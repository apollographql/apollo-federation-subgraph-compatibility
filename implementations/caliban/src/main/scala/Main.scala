import caliban.ZHttpAdapter
import sttp.tapir.json.zio._
import zio.Console.printLine
import zio.http.{ Server, ServerConfig }
import zio.{ ZIOAppDefault, ZLayer }

object Main extends ZIOAppDefault {
  override def run =
    (for {
      _           <- printLine("Starting server")
      interpreter <- ProductApi.interpreter
      _           <- Server.serve(ZHttpAdapter.makeHttpService(interpreter).withDefaultErrorResponse)
    } yield ()).provide(
      ZLayer.succeed(ServerConfig.default.port(4001)),
      Server.live,
      ProductService.inMemory,
      UserService.inMemory,
      InventoryService.inMemory
    )
}
