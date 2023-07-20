FROM node:18-alpine
WORKDIR /web
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build
EXPOSE 4001
USER node
WORKDIR /web/dist
CMD node index.js
