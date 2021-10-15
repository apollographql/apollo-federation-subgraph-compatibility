<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use function array_filter;
use function array_values;

class DataSource 
{
    private static array $products = [];

    public static function init(): void
    {
        self::$products = [
            new Product([
                'id'        => 'apollo-federation',
                'sku'       => 'federation',
                'package'   => '@apollo/federation',
                'variation' => 'OSS',
            ]),
            new Product([
                'id'        => 'apollo-studio',
                'sku'       => 'studio',
                'package'   => '',
                'variation' => 'platform',
            ]),
        ];
    }

    public static function findProduct(string $id) {
        $productsFound = array_filter(
            self::$products,
            static fn (Product $product): bool => $product->id === $id
        );

        return array_values($productsFound)[0] ?? null;
    }

    public static function findProductBySkuAndPackage(string $sku, string $package) {
        $productsFound = array_filter(
            self::$products,
            static fn (Product $product): bool => $product->sku === $sku && $product->package === $package
        );

        return array_values($productsFound)[0] ?? null;
    }

    public static function findProductBySkuAndVariation(string $sku, string $variation) {
        $productsFound = array_filter(
            self::$products,
            static fn (Product $product): bool => $product->sku === $sku && $product->variation === $variation
        );

        return array_values($productsFound)[0] ?? null;
    }
}