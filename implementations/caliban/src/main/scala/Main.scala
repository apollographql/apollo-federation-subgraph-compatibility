import caliban.quick._
import services.{ InventoryService, ProductService, UserService }
import zio.Console.printLine
import zio.ZIOAppDefault

object Main extends ZIOAppDefault {
  override def run =
    printLine("Starting server") *>
      ProductApi.graphql
        .runServer(4001, "/")
        .provide(
          ProductService.inMemory,
          UserService.inMemory,
          InventoryService.inMemory
        )
}
