FROM maven:3-eclipse-temurin-25

WORKDIR /build
COPY src ./src
COPY pom.xml ./
RUN mvn install
RUN mvn package
EXPOSE 4001
CMD java -jar target/dgs-compatibility-*.jar
