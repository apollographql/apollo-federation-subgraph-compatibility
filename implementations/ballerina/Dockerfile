FROM ballerina/ballerina:2201.13.6
EXPOSE 4001
COPY . /subgraph
USER root
RUN chmod -R 777 /subgraph
RUN bal build /subgraph
CMD bal run --offline /subgraph
