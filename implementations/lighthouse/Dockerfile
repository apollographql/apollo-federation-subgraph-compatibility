FROM php:8.0-cli

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apt-get update \
    && apt-get install -y git zip unzip zlib1g-dev libzip-dev \
    && docker-php-ext-install zip \
    && docker-php-ext-install pcntl \
    && docker-php-ext-install bcmath

WORKDIR /workdir
COPY . /workdir

RUN composer install --no-dev \
    && touch database/database.sqlite \
    && php artisan migrate:fresh --seed

EXPOSE 4001

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=4001"]
