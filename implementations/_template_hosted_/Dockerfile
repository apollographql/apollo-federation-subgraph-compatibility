FROM nginx

ARG API_KEY
COPY ./proxy.conf.template /etc/nginx/conf.d/default.conf
RUN sed -i "s/X-SUBGRAPH-API-KEY/${API_KEY}/g" /etc/nginx/conf.d/default.conf