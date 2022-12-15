FROM node:14-alpine
WORKDIR /web
COPY *.js *.js.map *.cjs package.json inventory.graphql ./
EXPOSE 4003
USER node
CMD node index.js
