<?php

declare(strict_types=1);

namespace GraphQL\Compatibility;

use Closure;
use Exception;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Type\Definition\NonNull;

use GraphQL\Compatibility\Type\ProductType;
use GraphQL\Compatibility\Type\ProductDimensionType;
use GraphQL\Compatibility\Type\ProductVariationType;
use GraphQL\Compatibility\Type\UserType;

use function class_exists;
use function count;
use function explode;
use function lcfirst;
use function method_exists;
use function preg_replace;
use function strtolower;

class Types {
    private static array $types = [];

    public static function product(): callable
    {
        return static::get(ProductType::class);
    }

    public static function productDimension(): callable
    {
        return static::get(ProductDimensionType::class);
    }

    public static function productVariation(): callable
    {
        return static::get(ProductVariationType::class);
    }

    public static function user(): callable
    {
        return static::get(UserType::class);
    }

    public static function float(): ScalarType
    {
        return Type::float();
    }

    public static function id(): ScalarType
    {
        return Type::id();
    }
    
    public static function int(): ScalarType
    {
        return Type::int();
    }

    public static function string(): ScalarType
    {
        return Type::string();
    }

    public static function nonNull($type): NonNull
    {
        return new NonNull($type);
    }

    private static function get(string $classname): Closure
    {
        return static fn () => static::byClassName($classname);
    }

    private static function byClassName(string $classname): Type
    {
        $parts = explode('\\', $classname);

        $cacheName = strtolower(preg_replace('~Type$~', '', $parts[count($parts) - 1]));
        $type      = null;

        if (! isset(self::$types[$cacheName])) {
            if (class_exists($classname)) {
                $type = new $classname();
            }

            self::$types[$cacheName] = $type;
        }

        $type = self::$types[$cacheName];

        if (! $type) {
            throw new Exception('Unknown graphql type: ' . $classname);
        }

        return $type;
    }

    public static function byTypeName(string $shortName): Type
    {
        $cacheName = strtolower($shortName);
        $type      = null;

        if (isset(self::$types[$cacheName])) {
            return self::$types[$cacheName];
        }

        $method = lcfirst($shortName);
        if (method_exists(static::class, $method)) {
            $type = self::{$method}();
        }

        if (! $type) {
            throw new Exception('Unknown graphql type: ' . $shortName);
        }

        return $type;
    }
}