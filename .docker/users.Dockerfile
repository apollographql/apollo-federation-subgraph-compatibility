FROM node:14-alpine
WORKDIR /apollo-federation-testing/users
COPY . /apollo-federation-testing/users
RUN rm -frv /apollo-federation-testing/users/src/implementations/*
RUN rm -frv /apollo-federation-testing/users/src/gateway.ts
RUN rm -frv /apollo-federation-testing/users/src/index.ts
RUN rm -frv /apollo-federation-testing/users/src/subgraphs/inventory.ts
RUN rm -frv /apollo-federation-testing/users/src/subgraphs/inventory.graphql
RUN rm -frv /apollo-federation-testing/users/src/subgraphs/products.graphql
RUN rm -frv /apollo-federation-testing/.docker/*
RUN rm -frv /apollo-federation-testing/.vscode/*
RUN rm -frv /apollo-federation-testing/.deployments/*
RUN rm -frv /apollo-federation-testing/node_modules/*
RUN npm install
RUN npm uninstall @apollo/gateway
RUN npm uninstall concurrently
EXPOSE 4002
CMD [ "npm", "run", "start:users" ]