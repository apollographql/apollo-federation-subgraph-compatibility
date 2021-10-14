<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Compatibility\Data\DataSource;

use GraphQL\Type\Definition\ObjectType;

class QueryType extends ObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'   => 'Query',
            'fields' => [
                'product' => [
                    'type' => Types::product(),
                    'args' => [
                        'id' => Types::nonNull(Types::id()),
                    ],
                    'resolve' => static function ($_, $args) {
                        return DataSource::findProduct($args['id']);
                    }
                ],
            ],
        ]);
    }
}