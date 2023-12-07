<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Route Configuration
    |--------------------------------------------------------------------------
    |
    | Controls the HTTP route that your GraphQL server responds to.
    | You may set `route` => false, to disable the default route
    | registration and take full control.
    |
    */

    'route' => [
        /*
         * The URI the endpoint responds to, e.g. mydomain.com/graphql.
         */
        'uri' => '/',

        /*
         * Beware that middleware defined here runs before the GraphQL execution phase,
         * make sure to return spec-compliant responses in case an error is thrown.
         */
        'middleware' => [
            \Nuwave\Lighthouse\Http\Middleware\AcceptJson::class,

            // Logs in a user if they are authenticated. In contrast to Laravel's 'auth'
            // middleware, this delegates auth and permission checks to the field level.
            \Nuwave\Lighthouse\Http\Middleware\AttemptAuthentication::class,

            // Logs every incoming GraphQL query.
            \Nuwave\Lighthouse\Http\Middleware\LogGraphQLQueries::class,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Debug
    |--------------------------------------------------------------------------
    |
    | Control the debug level as described in https://webonyx.github.io/graphql-php/error-handling/
    | Debugging is only applied if the global Laravel debug config is set to true.
    |
    | When you set this value through an environment variable, use the following reference table:
    |  0 => INCLUDE_NONE
    |  1 => INCLUDE_DEBUG_MESSAGE
    |  2 => INCLUDE_TRACE
    |  3 => INCLUDE_TRACE | INCLUDE_DEBUG_MESSAGE
    |  4 => RETHROW_INTERNAL_EXCEPTIONS
    |  5 => RETHROW_INTERNAL_EXCEPTIONS | INCLUDE_DEBUG_MESSAGE
    |  6 => RETHROW_INTERNAL_EXCEPTIONS | INCLUDE_TRACE
    |  7 => RETHROW_INTERNAL_EXCEPTIONS | INCLUDE_TRACE | INCLUDE_DEBUG_MESSAGE
    |  8 => RETHROW_UNSAFE_EXCEPTIONS
    |  9 => RETHROW_UNSAFE_EXCEPTIONS | INCLUDE_DEBUG_MESSAGE
    | 10 => RETHROW_UNSAFE_EXCEPTIONS | INCLUDE_TRACE
    | 11 => RETHROW_UNSAFE_EXCEPTIONS | INCLUDE_TRACE | INCLUDE_DEBUG_MESSAGE
    | 12 => RETHROW_UNSAFE_EXCEPTIONS | RETHROW_INTERNAL_EXCEPTIONS
    | 13 => RETHROW_UNSAFE_EXCEPTIONS | RETHROW_INTERNAL_EXCEPTIONS | INCLUDE_DEBUG_MESSAGE
    | 14 => RETHROW_UNSAFE_EXCEPTIONS | RETHROW_INTERNAL_EXCEPTIONS | INCLUDE_TRACE
    | 15 => RETHROW_UNSAFE_EXCEPTIONS | RETHROW_INTERNAL_EXCEPTIONS | INCLUDE_TRACE | INCLUDE_DEBUG_MESSAGE
    |
    */

    'debug' => \GraphQL\Error\DebugFlag::INCLUDE_DEBUG_MESSAGE | \GraphQL\Error\DebugFlag::INCLUDE_TRACE,

    /*
    |--------------------------------------------------------------------------
    | Tracing
    |--------------------------------------------------------------------------
    |
    | Configuration for tracing support.
    |
    */

    'tracing' => [
        /*
         * Driver used for tracing.
         *
         * Accepts the fully qualified class name of a class that implements Nuwave\Lighthouse\Tracing\Tracing.
         * Lighthouse provides:
         * - Nuwave\Lighthouse\Tracing\ApolloTracing\ApolloTracing::class
         * - Nuwave\Lighthouse\Tracing\FederatedTracing\FederatedTracing::class
         *
         * In Lighthouse v7 the default will be changed to 'Nuwave\Lighthouse\Tracing\FederatedTracing\FederatedTracing::class'.
         */
        'driver' => Nuwave\Lighthouse\Tracing\FederatedTracing\FederatedTracing::class,
    ],
];
