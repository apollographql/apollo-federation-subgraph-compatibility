FROM node:17-alpine
WORKDIR /web
COPY package.json package-lock.json products.graphql tsconfig.json codegen.yaml ./
COPY src ./src
RUN npm install
RUN npm run build
EXPOSE 4001
USER node
CMD npm run start
