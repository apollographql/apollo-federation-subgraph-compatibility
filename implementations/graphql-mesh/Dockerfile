FROM node:17-alpine

WORKDIR /web

COPY package.json package-lock.json ./
RUN npm install

COPY src ./src
COPY products.graphql tsconfig.json codegen.yaml .meshrc.yml ./

RUN npm run build

EXPOSE 4001
CMD npm run start
