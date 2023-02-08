<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use function array_filter;
use function array_values;

class DataSource
{
    private static array $users = [];
    private static array $productResearch = [];
    private static array $products = [];
    private static array $deprecatedProducts = [];

    public static function init(): void
    {
        self::$users = [
            new User([
                'email' => 'support@apollographql.com',
                'name' => 'Jane Smith',
            ]),
        ];

        self::$productResearch = [
            new ProductResearch([
                'study' => new CaseStudy([
                    'caseNumber'  => '1234',
                    'description' => 'Federation Study',
                ]),
            ]),
            new ProductResearch([
                'study' => new CaseStudy([
                    'caseNumber'  => '1235',
                    'description' => 'Studio Study',
                ]),
            ]),
        ];

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

        self::$deprecatedProducts = [
            new DeprecatedProduct([
                'sku'       => 'apollo-federation-v1',
                'package'   => '@apollo/federation-v1',
                'reason' => 'Migrate to Federation V2',
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

    public static function findDeprecatedProductBySkuAndPackage(string $sku, string $package) {
        $deprecatedProductsFound = array_filter(
            self::$deprecatedProducts,
            static fn (DeprecatedProduct $product): bool => $product->sku === $sku && $product->package === $package
        );

        return array_values($deprecatedProductsFound)[0] ?? null;
    }

    public static function findProductResearch(string $caseNumber) {
        $researchFound = array_filter(
            self::$productResearch,
            static fn (ProductResearch $research): bool => $research->study->caseNumber === $caseNumber
        );
        return array_values($researchFound)[0] ?? null;
    }

    public static function findResearchForProduct(string $productId) {
        $researchFound = array_filter(
            self::$productResearch,
            static fn (ProductResearch $research): bool => ($research->study->caseNumber === '1234' && $productId === 'apollo-federation') || ($research->study->caseNumber === '1235' && $productId === 'apollo-studio')
        );
        return array_values($researchFound) ?? [];
    }

    public static function findUser(string $email) {
        $usersFound = array_filter(
            self::$users,
            static fn (User $user): bool => $user->email === $email
        );

        return array_values($usersFound)[0] ?? null;
    }
}
