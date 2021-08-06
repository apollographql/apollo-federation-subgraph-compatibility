FROM node:14-alpine
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm install
COPY index.js users.graphql ./
EXPOSE 4002
USER node
CMD node index.js
