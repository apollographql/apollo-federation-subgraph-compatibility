<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Compatibility\Data\User;
use GraphQL\Compatibility\Data\DataSource;
use Apollo\Federation\Types\EntityRefObjectType;

class UserType extends EntityRefObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'      => 'User',
            'keyFields' => [ 'email' ],
            'fields'    => [
                'averageProductsCreatedPerYear' => [
                    'type' => Types::int(),
                    'requires' => 'totalProductsCreated yearsOfEmployment',
                    'resolve' => static function ($ref) {
                        if ($ref->totalProductsCreated !== null && $ref->yearsOfEmployment !== null) {
                            return round($ref->totalProductsCreated / $ref->yearsOfEmployment);
                        }

                        return null;
                    }
                ],
                'email' => [ 'type' => Types::nonNull(Types::id()) ],
                'name' => [ 'type' => Types::string() ],
                'totalProductsCreated' => [
                    'type'       => Types::int(),
                    'isExternal' => true
                ],
                'yearsOfEmployment' => [
                    'type' => Types::nonNull(Types::int()),
                    'isExternal' => true
                ]
            ],
            '__resolveReference' => function ($ref) {
                $email = $ref['email'];
                if($email !== null) {
                    $user = DataSource::findUser($email);
                    if (array_key_exists('totalProductsCreated', $ref)) {
                        $user->{'totalProductsCreated'} = $ref['totalProductsCreated'];
                    }

                    if (array_key_exists('yearsOfEmployment', $ref)) {
                        $user->{'yearsOfEmployment'} = $ref['yearsOfEmployment'];
                    }
                    return $user;
                }
            },
            'isTypeOf' => function ($value) {
                if ($value instanceof User) {
                    return true;
                }
            },
        ]);
    }
}
