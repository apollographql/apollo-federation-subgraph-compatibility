<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use GraphQL\Utils\Utils;

class User
{
    public string $email;

    public string $name;

    public int $totalProductsCreated;

    public int $yearsOfEmployment;

    public function __construct(array $data)
    {
        Utils::assign($this, $data);
    }
}
