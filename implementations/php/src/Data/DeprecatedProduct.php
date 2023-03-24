<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use GraphQL\Utils\Utils;

class DeprecatedProduct
{
    public string $sku;

    public string $package;

    public string $reason;

    public function __construct(array $data)
    {
        Utils::assign($this, $data);
    }
}
