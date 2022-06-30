FROM nginx

ARG SUBGRAPH_API_KEY
ARG SUBGRAPH_URL
COPY ./proxy.conf.template /etc/nginx/conf.d/default.conf
RUN sed -i "s/X-SUBGRAPH-API-KEY/${SUBGRAPH_API_KEY}/g" /etc/nginx/conf.d/default.conf &&\
  sed -i "s,X-SUBGRAPH-URL,${SUBGRAPH_URL},g" /etc/nginx/conf.d/default.conf