<?php

namespace App\Application\Controller;

use App\Application\GraphQL\Context;
use App\Application\GraphQL\TypeRegistry;
use GraphQL\Error\DebugFlag;
use GraphQL\GraphQL;
use GraphQL\Server\ServerConfig;
use GraphQL\Server\StandardServer;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use Symfony\Bridge\PsrHttpMessage\HttpMessageFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use GraphQL\Validator\Rules;

class GraphQLController extends AbstractController
{
    public function __construct(
//        private readonly TypeRegistry $typeRegistry,
        private readonly HttpMessageFactoryInterface $httpFactory
    ) {}

    #[Route('/graphql', name: 'graphql')]
    public function index(Request $request): Response
    {
        $typeRegistry = $this->typeRegistry;
        $schema = new Schema([
            'query' => $typeRegistry->getType('Query'),
            'mutation' => $typeRegistry->getType('Mutation'),
            'typeLoader' => static function (string $typeName) use ($typeRegistry): Type {
                return $typeRegistry->getType($typeName);
            }
        ]);

        $debugFlag = DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE;

        $validationRules = array_merge(
            GraphQL::getStandardValidationRules(),
            [
                new Rules\QueryComplexity(PHP_INT_MAX),
            ]
        );

        $psrRequest = $this->httpFactory
            ->createRequest($request)
            ->withParsedBody(json_decode($request->getContent(), true))
        ;
        $config = ServerConfig::create()
            ->setContext(new Context($this->getUser()))
            ->setValidationRules($validationRules)
            ->setSchema($schema)
            ->setQueryBatching(true)
            ->setDebugFlag($debugFlag)
        ;

        $server = new StandardServer($config);
        $psrResponse = $server->executePsrRequest($psrRequest);
        return new JsonResponse($psrResponse);
    }
}
