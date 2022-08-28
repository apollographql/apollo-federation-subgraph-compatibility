import sbt._

version := "1.4.1"
scalaVersion := "2.13.8"

val zioJsonV = "0.3.0-RC10"
val zioHttpV = "1.0.0.0-RC20"
val calibanV = "2.0.1"

libraryDependencies ++= List(
  "dev.zio"               %% "zio-json"           % zioJsonV,
  "io.d11"                %% "zhttp"              % zioHttpV,
  "com.github.ghostdogpr" %% "caliban"            % calibanV,
  "com.github.ghostdogpr" %% "caliban-federation" % calibanV,
  "com.github.ghostdogpr" %% "caliban-zio-http"   % calibanV
)
