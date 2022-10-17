import sbt._

version := "1.0.0"
scalaVersion := "2.13.9"

val http4sVersion = "1.0.0-M37"
val circeVersion = "0.14.3"

libraryDependencies ++= List(
  "org.sangria-graphql" %% "sangria-federated" % "0.4.0",
  "org.sangria-graphql" %% "sangria-circe" % "1.3.2",
  "org.http4s" %% "http4s-ember-server" % http4sVersion,
  "org.http4s" %% "http4s-dsl" % http4sVersion,
  "org.http4s" %% "http4s-circe" % http4sVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-optics" % "0.14.1"
)
