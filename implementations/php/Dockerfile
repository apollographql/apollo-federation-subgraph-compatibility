FROM php:7.4-cli

COPY . /usr/app
WORKDIR /usr/app

EXPOSE 4001

CMD [ "php", "-S", "0.0.0.0:4001", "./src/server.php" ]
