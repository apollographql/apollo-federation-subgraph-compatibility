FROM gradle:7-jdk17
WORKDIR /home/gradle
COPY . /home/gradle
RUN gradle build
CMD gradle bootRun
