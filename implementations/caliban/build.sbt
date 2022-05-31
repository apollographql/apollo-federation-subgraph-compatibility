import sbt._

version := "1.4.1"
scalaVersion := "2.13.6"

val zioJsonV = "0.1.5"
val zioHttpV = "1.0.0.0-RC17"
val calibanV = "1.4.1"

libraryDependencies ++= List(
  "dev.zio"               %% "zio-json"           % zioJsonV,
  "io.d11"                %% "zhttp"              % zioHttpV,
  "com.github.ghostdogpr" %% "caliban"            % calibanV,
  "com.github.ghostdogpr" %% "caliban-federation" % calibanV,
  "com.github.ghostdogpr" %% "caliban-zio-http"   % calibanV
)
