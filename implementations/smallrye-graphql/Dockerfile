FROM registry.access.redhat.com/ubi8/openjdk-17:1.20

ENV LANGUAGE='en_US:en'

# Copy all the required build files
COPY .mvn ./.mvn
COPY src ./src
COPY mvnw ./
COPY mvnw.cmd ./
COPY pom.xml ./

# Package it up
RUN ./mvnw package

# We make four distinct layers so if there are application changes the library layers can be re-used
RUN cp -r target/quarkus-app/lib/ /deployments/lib/ && chown -R 185:185 /deployments/lib/
RUN cp target/quarkus-app/*.jar /deployments/ && chown -R 185:185 /deployments/
RUN cp -r target/quarkus-app/app/ /deployments/app/ && chown -R 185:185 /deployments/app/
RUN cp -r target/quarkus-app/quarkus/ /deployments/quarkus/ && chown -R 185:185 /deployments/quarkus/

EXPOSE 4001
USER 185
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]