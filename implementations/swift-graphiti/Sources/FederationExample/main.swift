import Foundation
import GraphQL
import Graphiti
import Vapor

let application = try Application(.detect())

let schema = try SchemaBuilder(ProductResolver.self, ProductContext.self)
    .use(partials: [ProductSchema()])
    .setFederatedSDL(to: loadSDL())
    .build()

let api = ProductAPI(resolver: ProductResolver(), schema: schema)

application.post("") { req in
    let request = try req.content.decode(GraphQLRequest.self)
    return try await api.execute(
        request: request.query,
        context: ProductContext(db: StaticData.self),
        on: application.eventLoopGroup,
        variables: request.variables,
        operationName: request.operationName)
}

defer { application.shutdown() }
try application.run()

func loadSDL() throws -> String {
    guard let url = Bundle.module.url(forResource: "products", withExtension: "graphql") else {
        throw Abort(.internalServerError)
    }
    return try String(contentsOf: url)
}

// Required so Vapor can serialize the response
extension GraphQLResult: Content {}
