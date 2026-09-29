FROM node:24-alpine
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json index.ts ./
EXPOSE 4001
USER node
CMD npm start
