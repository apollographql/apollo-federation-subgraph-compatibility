FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/federation-jvm-compatibility-0.6.4.jar
COPY target/dependency ./dependency
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-cp","/dependency/*:/app.jar","com.apollographql.federation.compatibility.App"]
EXPOSE 4001