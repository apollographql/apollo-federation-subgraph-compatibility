FROM node:24-alpine
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm install
COPY index.js products.graphql ./
EXPOSE 4001
USER node
CMD node index.js
