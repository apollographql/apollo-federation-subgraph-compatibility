FROM maven

WORKDIR /build
COPY src ./src
COPY pom.xml ./
RUN mvn install -Dgpg.skip
RUN mvn package
RUN mvn dependency:copy-dependencies
EXPOSE 4001
CMD java -cp target/dependency/*:target/federation-jvm-compatibility-0.6.4.jar com.apollographql.federation.compatibility.App
