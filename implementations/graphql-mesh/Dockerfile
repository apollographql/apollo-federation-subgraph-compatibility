FROM node:17-alpine

WORKDIR /web

COPY package.json package-lock.json ./
RUN npm install

COPY src ./src
COPY products.graphql tsconfig.json codegen.yaml ./
RUN npm run build

COPY .meshrc.yml ./
EXPOSE 4001
CMD npm run start
