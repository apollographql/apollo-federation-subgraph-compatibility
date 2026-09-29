import sbt.*

version      := "3.1.5"
scalaVersion := "2.13.18"

val calibanV = "3.1.5"

libraryDependencies ++= List(
  "com.github.ghostdogpr" %% "caliban"            % calibanV,
  "com.github.ghostdogpr" %% "caliban-quick"      % calibanV,
  "com.github.ghostdogpr" %% "caliban-federation" % calibanV
)
