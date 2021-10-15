<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use Apollo\Federation\Types\EntityRefObjectType;

class UserType extends EntityRefObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'      => 'User',
            'keyFields' => [ 'email' ],
            'fields'    => [
                'email' => [ 'type' => Types::nonNull(Types::id()) ],
                'totalProductsCreated' => [
                    'type'       => Types::int(),
                    'isExternal' => true
                ],
            ]
        ]);
    }
}