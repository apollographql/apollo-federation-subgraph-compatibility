FROM hseeberger/scala-sbt:17.0.2_1.6.2_3.1.1 AS build

WORKDIR /build
COPY project/build.properties ./project/
COPY build.sbt ./
COPY src ./src
EXPOSE 4001
CMD sbt run
