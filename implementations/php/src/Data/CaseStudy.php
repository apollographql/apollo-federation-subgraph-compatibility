<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Data;

use GraphQL\Utils\Utils;

class CaseStudy
{
    public string $caseNumber;

    public string $description;

    public function __construct(array $data)
    {
        Utils::assign($this, $data);
    }
}
