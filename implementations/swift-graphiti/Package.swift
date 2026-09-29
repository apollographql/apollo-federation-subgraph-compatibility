// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "SwiftGraphiti",
    platforms: [
        .macOS(.v10_15),
    ],
    products: [
        .executable(name: "FederationExample", targets: ["FederationExample"])
    ],
    dependencies: [
        .package(url: "https://github.com/GraphQLSwift/Graphiti", from: "3.1.0"),
        .package(url: "https://github.com/GraphQLSwift/GraphQL", from: "4.2.0"),
        .package(url: "https://github.com/vapor/vapor", from: "4.122.2"),
    ],
    targets: [
        .executableTarget(name: "FederationExample", dependencies: [
            .product(name: "Graphiti", package: "Graphiti"),
            .product(name: "GraphQL", package: "GraphQL"),
            .product(name: "Vapor", package: "vapor"),
        ], resources: [
            .copy("products.graphql"),
        ])
    ]
)
