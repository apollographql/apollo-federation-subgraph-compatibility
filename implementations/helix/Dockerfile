FROM node:14-alpine
WORKDIR /web
COPY package.json package-lock.json products.graphql tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build
EXPOSE 4001
USER node
CMD node dist/index.js
