FROM hseeberger/scala-sbt:11.0.12_1.5.5_2.13.6 AS build

WORKDIR /build
COPY project/build.properties ./project/
COPY project/plugins.sbt ./project/
COPY build.sbt ./
COPY src ./src
EXPOSE 4001
CMD sbt compile run
