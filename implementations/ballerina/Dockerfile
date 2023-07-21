FROM ballerina/ballerina:latest
EXPOSE 4001
COPY . /subgraph
USER root
RUN chmod -R 777 /subgraph
CMD bal run /subgraph