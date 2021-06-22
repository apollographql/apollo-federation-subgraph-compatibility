FROM node:14-alpine
WORKDIR /apollo-federation-testing/graph-router
COPY . /apollo-federation-testing/graph-router
RUN rm -frv /apollo-federation-testing/graph-router/src/implementations/*
RUN rm -frv /apollo-federation-testing/.docker/*
RUN rm -frv /apollo-federation-testing/.vscode/*
RUN rm -frv /apollo-federation-testing/.deployments/*
RUN rm -frv /apollo-federation-testing/node_modules/*
RUN npm install
EXPOSE 4000
CMD [ "npm", "run", "start:graph-router" ]