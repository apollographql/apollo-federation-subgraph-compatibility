# Apollo Federation Subgraph Compatibility Testing Strategy

[![Latest Results](https://github.com/apollographql/apollo-federation-subgraph-compatibility/workflows/Release/badge.svg)](https://github.com/apollographql/apollo-federation-subgraph-compatibility/actions?query=workflow%3ARelease)
[![Join the community forum](https://img.shields.io/badge/join%20the%20community-forum-blueviolet)](https://community.apollographql.com)

The purpose of this repository is to provide a centralized strategy focused on understanding a given subgraph's compatibility against the [Apollo Federation Specification](https://www.apollographql.com/docs/federation/federation-spec/).

The following open-source GraphQL server libraries and hosted subgraphs provide support for Apollo Federation and are included in our test suite. If you want to see additional implementations added to this list, feel free to open an [Issue](https://github.com/apollographql/apollo-federation-subgraph-compatibility/issues) or check out our [Apollo Federation Library Maintainers Implementation Guide](./CONTRIBUTORS.md) to find information on how to submit a PR for your implementation!

* [C# / .NET](#c--net)
* [Elixir](#elixir)
* [Go](#go)
* [Java / Kotlin](#java--kotlin)
* [JavaScript / TypeScript](#javascript--typescript)
* [PHP](#php)
* [Python](#python)
* [Ruby](#ruby)
* [Rust](#rust)
* [Scala](#scala)
* [Hosted Subgraphs](#hosted-subgraphs)

## Table Legend

| Icon | Description |
| ---- | ----------- |
| 🟢 | Functionality is supported |
| ❌ | Critical functionality is NOT supported |
| 🔲 | Additional federation functionality is NOT supported |

## C# / .NET

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://graphql-dotnet.github.io">GraphQL for .NET</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🔲</td></tr><tr><th>@key (composite)</th><td>🔲</td></tr><tr><th>repeatable @key</th><td>🔲</td></tr><tr><th>@requires</th><td>🔲</td></tr><tr><th>@provides</th><td>🔲</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🔲</td></tr><tr><th>@tag</th><td>🔲</td></tr><tr><th>@override</th><td>🔲</td></tr><tr><th>@inaccessible</th><td>🔲</td></tr></table></td></tr>
<tr><td><a href="https://chillicream.com/docs/hotchocolate">Hot Chocolate</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🔲</td></tr><tr><th>@tag</th><td>🔲</td></tr><tr><th>@override</th><td>🔲</td></tr><tr><th>@inaccessible</th><td>🔲</td></tr></table></td></tr>
</tbody>
</table>

## Elixir

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/DivvyPayHQ/absinthe_federation">Absinthe.Federation</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## Go

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://gqlgen.com">gqlgen</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🔲</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## Java / Kotlin

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/netflix/dgs-framework/">dgs-framework</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://github.com/apollographql/federation-jvm">Federation JVM</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://github.com/graphql-java-kickstart/graphql-spring-boot">GraphQL Java Kickstart (Spring Boot)</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🔲</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://github.com/ExpediaGroup/graphql-kotlin">GraphQL Kotlin</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## JavaScript / TypeScript

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://www.apollographql.com/docs/federation/">Apollo Server</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://github.com/graphql/express-graphql">express-graphql</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://www.graphql-yoga.com/docs/features/apollo-federation">GraphQL Yoga</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://graphql-helix.vercel.app">GraphQL Helix</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://mercurius.dev/#/">Mercurius</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🔲</td></tr><tr><th>@tag</th><td>🔲</td></tr><tr><th>@override</th><td>🔲</td></tr><tr><th>@inaccessible</th><td>🔲</td></tr></table></td></tr>
<tr><td><a href="https://nestjs.com">NestJS</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://pothos-graphql.dev/docs/plugins/federation">Pothos GraphQL</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## PHP

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://lighthouse-php.com/">Lighthouse (Laravel)</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🔲</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🔲</td></tr><tr><th>@tag</th><td>🔲</td></tr><tr><th>@override</th><td>🔲</td></tr><tr><th>@inaccessible</th><td>🔲</td></tr></table></td></tr>
<tr><td><a href="https://github.com/Skillshare/apollo-federation-php">Apollo Federation PHP</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🔲</td></tr><tr><th>@tag</th><td>🔲</td></tr><tr><th>@override</th><td>🔲</td></tr><tr><th>@inaccessible</th><td>🔲</td></tr></table></td></tr>
</tbody>
</table>

## Python

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://ariadnegraphql.org/docs/apollo-federation">Ariadne</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://graphene-python.org/">Graphene</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://strawberry.rocks">Strawberry</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## Ruby

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://graphql-ruby.org/">GraphQL Ruby</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🔲</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🔲</td></tr></table></td></tr>
</tbody>
</table>

## Rust

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://async-graphql.github.io/async-graphql/en/apollo_federation.html">Async-graphql</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## Scala

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://ghostdogpr.github.io/caliban/docs/federation.html">Caliban</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://sangria-graphql.github.io/learn/#graphql-federation">Sangria</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🟢</td></tr></table></td><td><table><tr><th>@link</th><td>❌</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## Hosted Subgraphs

<table>
<thead>
<tr><th width="300">Library</th><th>Federation 1 Support</th><th>Federation 2 Support</th></tr>
</thead>
<tbody>
<tr><td><a href="https://aws.amazon.com/appsync/">AWS AppSync</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🟢</td></tr><tr><th>repeatable @key</th><td>🟢</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
<tr><td><a href="https://stepzen.com/apollo-stepzen">StepZen</a></td><td><table><tr><th>_service</th><td>🟢</td></tr><tr><th>@key (single)</th><td>🟢</td></tr><tr><th>@key (multi)</th><td>🟢</td></tr><tr><th>@key (composite)</th><td>🔲</td></tr><tr><th>repeatable @key</th><td>🔲</td></tr><tr><th>@requires</th><td>🟢</td></tr><tr><th>@provides</th><td>🟢</td></tr><tr><th>federated tracing</th><td>🔲</td></tr></table></td><td><table><tr><th>@link</th><td>🟢</td></tr><tr><th>@shareable</th><td>🟢</td></tr><tr><th>@tag</th><td>🟢</td></tr><tr><th>@override</th><td>🟢</td></tr><tr><th>@inaccessible</th><td>🟢</td></tr></table></td></tr>
</tbody>
</table>

## Testing Suite

This repository contains a structured testing suite based on a federated schema that covers the [Apollo Federation Specification](https://www.apollographql.com/docs/federation/federation-spec/). The federated schema is constructued of 3 subgraphs (`users`, `inventory` and `products`) that will be started and used to test various libraries that support Apollo Federation. The `users` and `inventory` subgraphs are provided by this repository in addition to the graph router instance. Library implementors will each implement the `products` schema and provide a docker file that can be used with `docker compose`. Templates for these files are provided along with examples.

### Subgraph Schemas

#### Users

```graphql
type User @key(fields: "email") {
  email: ID!
  name: String
  totalProductsCreated: Int
  yearsOfEmployment: Int!
}
```

#### Inventory

```graphql
extend type Product @key(fields: "id") {
  id: ID! @external
  dimensions: ProductDimension @external
  delivery(zip: String): DeliveryEstimates
    @requires(fields: "dimensions { size weight }")
}

type ProductDimension @shareable {
  size: String
  weight: Float
}

type DeliveryEstimates {
  estimatedDelivery: String
  fastestDelivery: String
}
```

#### Products (schema to be implemented by library maintainers)

```graphql
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.0",
    import: [
      "@extends",
      "@external",
      "@key",
      "@inaccessible",
      "@override",
      "@provides",
      "@requires",
      "@shareable",
      "@tag"
    ]
  )

type Product
  @key(fields: "id")
  @key(fields: "sku package")
  @key(fields: "sku variation { id }") {
    id: ID!
    sku: String
    package: String
    variation: ProductVariation
    dimensions: ProductDimension
    createdBy: User @provides(fields: "totalProductsCreated")
    notes: String @tag(name: "internal")
    research: [ProductResearch!]!
}

type DeprecatedProduct @key(fields: "sku package") {
  sku: String!
  package: String!
  reason: String
  createdBy: User
}

type ProductVariation {
  id: ID!
}

type ProductResearch @key(fields: "study { caseNumber }") {
  study: CaseStudy!
  outcome: String
}

type CaseStudy {
  caseNumber: ID!
  description: String
}

type ProductDimension @shareable {
  size: String
  weight: Float
  unit: String @inaccessible
}

extend type Query {
  product(id: ID!): Product
  deprecatedProduct(sku: String!, package: String!): DeprecatedProduct @deprecated(reason: "Use product query instead")
}

extend type User @key(fields: "email") {
  averageProductsCreatedPerYear: Int @requires(fields: "totalProductsCreated yearsOfEmployment")
  email: ID! @external
  name: String @override(from: "users")
  totalProductsCreated: Int @external
  yearsOfEmployment: Int! @external
}
```

### Testing Spec Compliance

Following tests are run to verify Federation Spec compliance.

#### Minimum functionality to support Apollo Federation

This is a minimum set of functionality to allow for API-side joins and use of entities in other subgraphs.

- `_service` - support a `rover subgraph introspect` command (this is the Apollo Federation equivalent of Introspection for subgraphs)
  - executes `query { _service { sdl } }` and verifies the contents of the SDL
- `@key` and `_entities` - support defining a single `@key`
  - Below is an example of the single `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
    _entities(representations: [{ "__typename": "User", "email": "support@apollographql.com" }]) {
        ...on User { email name }
      }
    }
}
```

- `@link` (required for Federation v2)
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result.

#### Additional functionality to fully support Apollo Federation

- `@key` and `_entities` - multiple `@key` definitions, multiple-fields `@key` and a composite object fields `@key`
  - Below is an example of a multiple fields `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
  _entities(representations: [{ "__typename": "DeprecatedProduct", "sku": "apollo-federation-v1", "package": "@apollo/federation-v1" }]) {
    ...on DeprecatedProduct { sku package reason }
  }
}
```

  - Below is an example of a composite object fields `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
  _entities(representations: [{ "__typename": "ProductResearch", "study": { "caseNumber": "1234" } }]) {
    ...on ProductResearch { study { caseNumber description } }
  }
}
```

  - Below is an example of a multiple `@key` query that is sent from the graph router to the implementing `products` subgraph:

```graphql
query {
  _entities(representations: [
     { "__typename": "Product", "id: "apollo-federation" },
     { "__typename": "Product", "sku": "federation", "package": "@apollo/federation" },
     { "__typename": "Product", "sku": "studio", "variation": { "id": "platform" } }
  ]) {
    ...on Product { id sku }
  }
}
```

- `@requires` - directive used to provide additional non-key information from one subgraph to the computed fields in another subgraph, should support defining complex fields
- - This will be covered by the subgraph implementors at `Product.createdBy` where they will be expected to provide the `User.averageProductsCreatedPerYear` using `yearsOfEmployment` value provided by the `user` graph and the `totalProductsCreated` value from the implementing `products` subgraph. Example query that will be sent directly to `products` subgraph.

```graphql
query ($id: ID!) {
  product(id: $id) {
    createdBy {
      averageProductsCreatedPerYear
      email
    }
  }
}
```

- `@provides` - directive used for path denormalization
  - This will be covered by the subgraph implementors at `Product.createdBy` where they will be expected to provide the `User.totalProductsCreated` to be _anything_ _other than 4_

```graphql
query ($id: ID!) {
  product(id: $id) {
    createdBy {
      email
      totalProductsCreated
    }
  }
}
```

- `@external` - directive used to mark fields as external (defined in other subgraph). This is covered in the tests above.
- `extends` or `@extends` - ability to extend the type that is defined in other subgraph
  - This is covered in the `products` subgraph extension of the `User`
- Federated Traces version 1 (`ftv1`)
  - A query with the `apollo-federated-include-trace:ftv1` header will be sent to the `products` subgraph which should return a value for the `extensions.ftv1` in the result.
  - _NOTE: In the initial release of this testing strategy, we will not be validating `ftv1` to ensure it's in the proper format_
- `@tag` - directive used to add arbitrary metadata information to the schema elements. Used by [Apollo Contracts](https://www.apollographql.com/docs/studio/contracts/) to expose different variants of the schema.
  - **Cannot be `@federation__` namespaced** - this directive has to be named consistently as `@tag` across all the subgraphs
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result.
- `@shareable` - directive that provides ability to relax single source of truth for entity fields
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to query shareable types.
- `@override` - directive used for migrating fields between subgraphs
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to return the value of an overridden field.
- `@inaccessible` - directive used to hide fields from the supergraph
  - **Cannot be `@federation__` namespaced** - this directive has to be named consistently as `@inacessible` across all the subgraphs
  - Must be seen as a valid schema directive in the SDL returned by the subgraph. Is verified by checking for its inclusion in the `query { _service { sdl } }` result. Must also be able to query inaccessible fields from the Products schema.

### Setting up the testing suite

1. `npm install`
2. `npm run setup`
   - `npm run build` - compiles typescript code and composes supergraph SDL
   - `npm run docker` - build docker images for `graph-router`, `users` and `inventory`

### Running the Test

`npm run test` will test all folders in the `implementations` folder. You can provide a comma separated string as an additional argument to test only specific implementations.

### Test Results

A `results.md` file will be created that contains the testing results.

## Contributing a new library to this test suite

Fork this repository and navigate to the [Apollo Federation Subgraph Maintainers Implementation Guide](./CONTRIBUTORS.md) for implementation instructions. Once you've completed the implementations instructions, feel free to create a PR and we'll review it. If you have any questions please open a GitHub issue on this repository.
