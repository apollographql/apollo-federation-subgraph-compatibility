FROM sbtscala/scala-sbt:eclipse-temurin-25.0.4_7_1.13.0_2.13.18 AS build

WORKDIR /build
COPY project/build.properties ./project/
COPY build.sbt ./
COPY src ./src
EXPOSE 4001
CMD sbt run
