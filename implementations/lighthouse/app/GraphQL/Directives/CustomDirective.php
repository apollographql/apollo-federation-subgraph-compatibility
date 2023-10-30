<?php

declare(strict_types=1);

namespace App\GraphQL\Directives;

use GraphQL\Language\AST\TypeDefinitionNode;
use Nuwave\Lighthouse\Schema\AST\DocumentAST;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;

final class CustomDirective extends BaseDirective
{
    public static function definition(): string
    {
        return <<<'GRAPHQL'
directive @custom on OBJECT
GRAPHQL;
    }
}
