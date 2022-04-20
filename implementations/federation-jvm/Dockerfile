FROM maven

WORKDIR /build
COPY src ./src
COPY pom.xml ./
RUN mvn install -Dgpg.skip
RUN mvn package
RUN mvn dependency:copy-dependencies
EXPOSE 4001
CMD java -cp target/dependency/*:target/federation-jvm-compatibility-2.0.0-alpha.5.jar org.springframework.boot.loader.JarLauncher
