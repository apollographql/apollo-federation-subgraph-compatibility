FROM node:16-alpine
WORKDIR /web
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm install
RUN npm run build
EXPOSE 4001
USER node
CMD node dist/main
