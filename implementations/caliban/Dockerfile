FROM sbtscala/scala-sbt:graalvm-ce-22.3.3-b1-java17_1.9.8_2.13.12 AS build

WORKDIR /build
COPY project/build.properties ./project/
COPY project/plugins.sbt ./project/
COPY build.sbt ./
COPY src ./src
EXPOSE 4001
CMD sbt compile run
