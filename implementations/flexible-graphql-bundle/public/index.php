<?php

use App\Application\Kernel;

$_SERVER['APP_RUNTIME_OPTIONS'] = [
    'disable_dotenv' => isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] === 'prod',
];

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
