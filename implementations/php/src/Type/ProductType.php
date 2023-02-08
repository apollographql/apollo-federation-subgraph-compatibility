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
                        'size'   => 'small',
                        'weight' => 1,
                        'unit'   => "kg"
                    ]
                ],
                'createdBy' => [
                    'type'     => Types::user(),
                    'provides' => 'totalProductsCreated',
                    'resolve'  => static fn (): array =>  [
                        'email' => 'support@apollographql.com',
                        'name' => 'Jane Smith',
                        'totalProductsCreated' => 1337,
                    ]
                ],
                'notes' => [ 'type'    => Types::string() ],
                'research' => [
                    'type' => Types::nonNull(Types::list(Types::nonNull(Types::productResearch()))),
                    'resolve' => static function ($ref): array {
                        return DataSource::findResearchForProduct($ref->id);
                    }
                ]
            ],
            '__resolveReference' => function ($ref) {
                $id = NULL;
                $sku = NULL;
                $package = NULL;
                $variation = NULL;

                if (array_key_exists('id', $ref)) {
                    $id = $ref['id'];
                }
                if (array_key_exists('sku', $ref)) {
                    $sku = $ref['sku'];
                }

                if (array_key_exists('package', $ref)) {
                    $package = $ref['package'];
                }

                if (array_key_exists('variation', $ref)) {
                    $tmp = $ref['variation'];
                    if (array_key_exists('id', $tmp)) {
                        $variation = $tmp['id'];
                    }
                }

                if($id !== null) {
                    return DataSource::findProduct($id);
                } else if ($sku !== null && $package !== null) {
                    return DataSource::findProductBySkuAndPackage($sku, $package);
                } else if ($sku !== null && $variation !== null) {
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
