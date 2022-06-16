FROM gradle:jdk17
WORKDIR /home/gradle
COPY . /home/gradle
RUN gradle build
CMD gradle bootRun
