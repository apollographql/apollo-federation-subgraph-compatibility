import sbt.*

version      := "2.4.3"
scalaVersion := "2.13.12"

val calibanV = "2.4.3"

libraryDependencies ++= List(
  "com.github.ghostdogpr" %% "caliban"            % calibanV,
  "com.github.ghostdogpr" %% "caliban-quick"      % calibanV,
  "com.github.ghostdogpr" %% "caliban-federation" % calibanV
)
