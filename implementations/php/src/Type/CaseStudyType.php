<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Type\Definition\ObjectType;

class CaseStudyType extends ObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'   => 'CaseStudy',
            'fields' => [
                'caseNumber' => [ 'type' => Types::nonNull(Types::id()) ],
                'description' => [ 'type' => Types::string() ]
            ]
        ]);
    }
}
