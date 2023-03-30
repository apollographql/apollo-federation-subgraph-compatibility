<?php

declare(strict_types=1);

namespace GraphQL\Compatibility\Type;

use GraphQL\Compatibility\Types;
use GraphQL\Compatibility\Data\ProductResearch;
use GraphQL\Compatibility\Data\DataSource;

use Apollo\Federation\Types\EntityObjectType;

class ProductResearchType extends EntityObjectType {
    public function __construct()
    {
        parent::__construct([
            'name'   => 'ProductResearch',
            'keyFields' => ['study { caseNumber }'],
            'fields' => [
                'study' => ['type' => Types::nonNull(Types::caseStudy())],
                'outcome' => [ 'type' => Types::string() ]
            ],
            '__resolveReference' => function ($ref) {
                $study = $ref['study'] !== NULL ? $ref['study']['caseNumber'] : NULL;

                if($study !== null) {
                    return DataSource::findProductResearch($study);
                }
            },
            'isTypeOf' => function ($value) {
                if ($value instanceof ProductResearch) {
                    return true;
                }
            },
        ]);
    }
}
