FROM ballerina/ballerina:2201.14.1
EXPOSE 4001
COPY . /subgraph
USER root
RUN chmod -R 777 /subgraph
RUN bal build /subgraph
CMD bal run --offline /subgraph
