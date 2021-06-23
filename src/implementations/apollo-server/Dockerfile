FROM node:14-alpine
WORKDIR /apollo-federation-testing/apollo-server
COPY . /apollo-federation-testing/apollo-server
RUN npm install
RUN npm run build
EXPOSE 4001
CMD [ "npm", "start" ]