<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use GraphQL\Utils\Utils;

class ProductResearch
{
    public CaseStudy $study;

    public string $outcome;

    public function __construct(array $data)
    {
        Utils::assign($this, $data);
    }
}
