<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Compatibility\Data\Product;
use GraphQL\Compatibility\Data\DataSource;

use Apollo\Federation\Types\EntityObjectType;

class ProductType extends EntityObjectType {
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'keyFields' => ['id', 'sku package', 'sku variation { id }'],
            'fields'    => [
                'id'        => [ 'type' => Types::nonNull(Types::id()) ],
                'sku'       => [ 'type' => Types::string() ],
                'package'   => [ 'type' => Types::string() ],
                'variation' => [ 
                    'type'    => Types::productVariation(),
                    'resolve' => static function ($ref): array {
                        if ($ref->variation !== null) {
                            return self::getVariation($ref->variation);
                        }

                        return self::getVariation(DataSource::findProduct($ref->id)->variation);
                    }
                ],
                'dimensions' => [ 
                    'type'    => Types::productDimension(),
                    'resolve' => static fn (): array => [
                        'size'   => '1',
                        'weight' => 1,
                    ]
                ],
                'createdBy' => [
                    'type'     => Types::user(),
                    'provides' => 'totalProductsCreated',
                    'resolve'  => static fn (): array => [
                        'email' => 'support@apollographql.com',
                        'totalProductsCreated' => 1337,
                    ]
                ]
            ],
            '__resolveReference' => function ($ref) {
                $id =        $ref['id'];
                $sku =       $ref['sku'];
                $package =   $ref['package'];
                $variation = $ref['variation'] !== NULL ? $ref['variation']['id'] : NULL;

                if($id !== null) {
                    return DataSource::findProduct($id);
                } else if ($sku !== null && $package !== null) {
                    return DataSource::findProductBySkuAndPackage($sku, $package);
                } else {
                    return DataSource::findProductBySkuAndVariation($sku, $variation);
                }
            },
            'isTypeOf' => function ($value) {
                if ($value instanceof Product) {
                    return true;
                }
            },
        ]);
    }

    static function getVariation(string $variation): array {
        return [ 'id' => $variation ];
    }
}