import sbt._

version := "1.0.0"
scalaVersion := "2.13.18"

val http4sVersion = "1.0.0-M48"
val circeVersion = "0.14.16"

libraryDependencies ++= List(
  "org.sangria-graphql" %% "sangria-federated" % "0.9.3",
  "org.sangria-graphql" %% "sangria-circe" % "1.3.2",
  "org.http4s" %% "http4s-ember-server" % http4sVersion,
  "org.http4s" %% "http4s-dsl" % http4sVersion,
  "org.http4s" %% "http4s-circe" % http4sVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-optics" % "0.15.1"
)
