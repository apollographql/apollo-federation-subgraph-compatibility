<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Compatibility\Data\DeprecatedProduct;
use GraphQL\Compatibility\Data\DataSource;

use Apollo\Federation\Types\EntityObjectType;

class DeprecatedProductType extends EntityObjectType {
    public function __construct()
    {
        parent::__construct([
            'name' => 'DeprecatedProduct',
            'keyFields' => ['sku package'],
            'fields'    => [
                'sku'       => [ 'type' => Types::nonNull(Types::string()) ],
                'package'   => [ 'type' => Types::nonNull(Types::string()) ],
                'reason' => [ 'type'    => Types::string() ],
                'createdBy' => [
                    'type'     => Types::user(),
                    'provides' => 'totalProductsCreated',
                    'resolve'  => static fn (): array => [
                        'email' => 'support@apollographql.com',
                        'totalProductsCreated' => 1337,
                    ]
                ],
            ],
            '__resolveReference' => function ($ref) {
                $sku =       $ref['sku'];
                $package =   $ref['package'];

                if ($sku !== null && $package !== null) {
                    return DataSource::findDeprecatedProductBySkuAndPackage($sku, $package);
                }
            },
            'isTypeOf' => function ($value) {
                if ($value instanceof DeprecatedProduct) {
                    return true;
                }
            },
        ]);
    }

    static function getVariation(string $variation): array {
        return [ 'id' => $variation ];
    }
}
