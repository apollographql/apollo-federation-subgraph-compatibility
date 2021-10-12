<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Type\Definition\ObjectType;

class ProductVariationType extends ObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'   => 'ProductVariation',
            'fields' => [
                'id' => ['type' => Types::nonNull(Types::id())],
            ]
        ]);
    }
}