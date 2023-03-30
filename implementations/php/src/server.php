<?php

declare(strict_types=1);

namespace GraphQL\Compatibility;

require_once __DIR__ . '/../vendor/autoload.php';

use Closure;
use Exception;

use GraphQL\Server\StandardServer;
use GraphQL\Type\Definition\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Compatibility\Type\QueryType;
use GraphQL\Compatibility\Data\DataSource;

use Apollo\Federation\FederatedSchema;

// turn off deprecation notices
error_reporting(E_ALL ^ E_DEPRECATED);

try {
    DataSource::init();

    $schema = new FederatedSchema([
        'query' => new QueryType(),
    ]);

    $server = new StandardServer([
        'schema' => $schema,
    ]);

    $server->handleRequest();
} catch (Throwable $error) {
    StandardServer::send500Error($error);
}
