FROM ballerina/ballerina:2201.7.0
EXPOSE 4001
COPY . /subgraph
USER root
RUN chmod -R 777 /subgraph
CMD bal run --offline /subgraph
