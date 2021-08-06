FROM node:14-alpine
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm install
COPY index.js inventory.graphql ./
EXPOSE 4003
USER node
CMD node index.js
