import sbt._

version := "2.1.0"
scalaVersion := "2.13.8"

val zioJsonV = "0.4.2"
val zioHttpV = "0.0.5"
val calibanV = "2.1.0" //"2.0.1"

libraryDependencies ++= List(
  "dev.zio"                     %% "zio-json"           % zioJsonV,
  "dev.zio"                     %% "zio-http"           % zioHttpV,
  "com.softwaremill.sttp.tapir" %% "tapir-json-zio"     % "1.2.11",
  "com.github.ghostdogpr"       %% "caliban"            % calibanV,
  "com.github.ghostdogpr"       %% "caliban-federation" % calibanV,
  "com.github.ghostdogpr"       %% "caliban-zio-http"   % calibanV
)
