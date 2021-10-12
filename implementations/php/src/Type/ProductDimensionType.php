<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Type\Definition\ObjectType;

class ProductDimensionType extends ObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'   => 'ProductDimension',
            'fields' => [
                'size'   => [ 'type' => Types::string() ],
                'weight' => [ 'type' => Types::float() ],
            ]
        ]);
    }
}