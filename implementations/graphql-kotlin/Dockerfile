FROM gradle:jdk16
WORKDIR /home/gradle
COPY . /home/gradle
RUN gradle build
CMD gradle bootRun
