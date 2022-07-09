FROM node:14-alpine
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm install
COPY index.ts ./
EXPOSE 4001
USER node
CMD npm start
