import caliban.QuickAdapter
import services.{ InventoryService, ProductService, UserService }
import zio.Console.printLine
import zio.{ ZIO, ZIOAppDefault }

object Main extends ZIOAppDefault {
  override def run =
    printLine("Starting server") *>
      (for {
        interpreter <- ProductApi.graphql.interpreter
        env         <- ZIO.environment[ProductService with UserService with InventoryService]
        _           <- QuickAdapter(interpreter.provideEnvironment(env)).runServer(4001, "/")
      } yield ())
        .provide(
          ProductService.inMemory,
          UserService.inMemory,
          InventoryService.inMemory
        )
}
