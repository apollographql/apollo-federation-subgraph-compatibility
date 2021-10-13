FROM php:7.4-cli

# Install Composer and utilities

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apt-get update \
    && apt-get install -y git zip unzip zlib1g-dev libzip-dev \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN docker-php-ext-install zip \
    && docker-php-ext-install pcntl \
    && docker-php-ext-install bcmath

# Copy source files

COPY . /usr/app
WORKDIR /usr/app

# Install dependencies

RUN composer install --no-dev --prefer-dist

EXPOSE 4001

CMD [ "php", "-S", "0.0.0.0:4001", "./src/server.php" ]
