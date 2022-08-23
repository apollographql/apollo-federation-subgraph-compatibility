import caliban.ZHttpAdapter
import zhttp.http._
import zhttp.service.Server
import zio.Console.printLine
import zio.ZIOAppDefault

object Main extends ZIOAppDefault {
  override def run =
    (for {
      _           <- printLine("Starting server")
      interpreter <- ProductApi.interpreter
      _           <- Server
                       .start(
                         4001,
                         Http.collectHttp { case _ -> !! =>
                           ZHttpAdapter.makeHttpService(interpreter)
                         }
                       )
                       .forever
    } yield ()).provide(ProductService.inMemory, UserService.inMemory).exitCode
}
