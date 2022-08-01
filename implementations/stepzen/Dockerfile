FROM nginx

ARG SUBGRAPH_URL
COPY ./proxy.conf.template /etc/nginx/conf.d/default.conf
RUN sed -i "s,X-SUBGRAPH-URL,${SUBGRAPH_URL},g" /etc/nginx/conf.d/default.conf

