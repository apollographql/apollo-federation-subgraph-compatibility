<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use GraphQL\Utils\Utils;

class Product
{
    public string $id;

    public string $sku;

    public string $package;

    public string $variation;

    public function __construct(array $data)
    {
        Utils::assign($this, $data);
    }
}