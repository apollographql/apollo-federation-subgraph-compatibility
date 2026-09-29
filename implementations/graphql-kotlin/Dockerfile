FROM gradle:9-jdk25
WORKDIR /home/gradle
COPY . /home/gradle
RUN gradle build
CMD gradle bootRun
