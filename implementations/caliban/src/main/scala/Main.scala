import caliban.ZHttpAdapter
import zhttp.http._
import zhttp.service.Server
import zio.console.putStrLn
import zio.{ ExitCode, URIO }

object Main extends zio.App {
  override def run(args: List[String]): URIO[zio.ZEnv, ExitCode] =
    (for {
      _           <- putStrLn("Starting server")
      interpreter <- ProductApi.interpreter
      _           <- Server
                       .start(
                         4001,
                         Http.route { case _ -> Root =>
                           ZHttpAdapter.makeHttpService(interpreter)
                         }
                       )
                       .forever
    } yield ()).provideCustomLayer(ProductService.inMemory).exitCode
}
