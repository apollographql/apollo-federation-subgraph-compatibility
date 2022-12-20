FROM node:18-alpine
WORKDIR /web
COPY *.js *.js.map *.cjs package.json users.graphql ./
EXPOSE 4002
USER node
CMD node index.js
