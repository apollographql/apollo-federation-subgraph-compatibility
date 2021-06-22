FROM node:14-alpine
WORKDIR /apollo-federation-testing/inventory
COPY . /apollo-federation-testing/inventory
RUN rm -frv /apollo-federation-testing/inventory/src/implementations/*
RUN rm -frv /apollo-federation-testing/inventory/src/gateway.ts
RUN rm -frv /apollo-federation-testing/inventory/src/index.ts
RUN rm -frv /apollo-federation-testing/inventory/src/subgraphs/users.ts
RUN rm -frv /apollo-federation-testing/inventory/src/subgraphs/users.graphql
RUN rm -frv /apollo-federation-testing/inventory/src/subgraphs/products.graphql
RUN rm -frv /apollo-federation-testing/.docker/*
RUN rm -frv /apollo-federation-testing/.vscode/*
RUN rm -frv /apollo-federation-testing/.deployments/*
RUN rm -frv /apollo-federation-testing/node_modules/*
RUN npm install
RUN npm uninstall @apollo/gateway
RUN npm uninstall concurrently
EXPOSE 4003
CMD [ "npm", "run", "start:inventory" ]