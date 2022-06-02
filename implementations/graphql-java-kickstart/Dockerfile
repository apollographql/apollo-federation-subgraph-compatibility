FROM maven

WORKDIR /build
COPY src ./src
COPY pom.xml ./
RUN mvn install
RUN mvn package
EXPOSE 4001
CMD java -jar target/graphql-java-kickstart-federation-compatibility-*.jar
