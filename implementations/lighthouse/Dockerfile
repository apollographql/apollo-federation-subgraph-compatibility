FROM php:8.2-cli

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apt-get update \
    && apt-get install --yes git zip unzip zlib1g-dev libzip-dev \
    && docker-php-ext-install zip pcntl bcmath

WORKDIR /workdir
COPY . /workdir

RUN composer install --no-progress \
    && touch database/database.sqlite \
    && php artisan migrate:fresh --seed

EXPOSE 4001

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=4001", "-vvv"]
