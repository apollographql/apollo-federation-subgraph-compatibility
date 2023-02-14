// swift-tools-version: 5.7
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
        .package(url: "https://github.com/GraphQLSwift/Graphiti", from: "1.7.0"),
        .package(url: "https://github.com/vapor/vapor", from: "4.0.0"),
    ],
    targets: [
        .executableTarget(name: "FederationExample", dependencies: [
            .product(name: "Graphiti", package: "Graphiti"),
            .product(name: "Vapor", package: "vapor"),
        ], resources: [
            .copy("products.graphql"),
        ])
    ]
)
