# Federated service hosted on AWS AppSync

## Pre-requisite
* An AWS Account to deploy the AppSync API
* NodeJS
* Docker

## Deploy

To deploy your own version of this `products` service on AppSync you will need to 

1. deploy the cdk stack:
    ```sh
    cd implementations/appsync/cdk
    npm install
    npm run build && npm run cdk deploy

     ✅  ProductsServiceStack

    Outputs:
    ProductsServiceStack.AppSyncApiEndpoint = https://xxxxxxxxxxxxxxxxxxxx.appsync-api.eu-west-1.amazonaws.com/graphql
    ProductsServiceStack.AppSyncApiKey = da2-yyyyyyyyyyyyyyyyy
    ```
1. Update nginx proxy conf `implementations/appsync/proxy/proxy.conf` with proper API_KEY and APPSYNC ENDPOINT:
    ```nginx
    server { 
    listen 4001;
    server_name products;
    location / {
        proxy_ssl_server_name on;
        proxy_set_header x-api-key "<YOUR API_KEY>";
        proxy_pass <YOUR APPSYNC ENDPOINT>;

        }
    }
    ```
1. Launch nginx proxy container
    ```
    cd ../../../../
    docker compose -f implementations/appsync/docker-compose.yaml up --build
    ```
1. Launch the test
    ```sh
    npm run test:jest



    > test:jest
    > jest src

        FAIL  src/tests/ftv1.test.ts (5.136 s)
        PASS  src/tests/requires.test.ts (5.126 s)
        PASS  src/tests/provides.test.ts (5.156 s)
        PASS  src/tests/introspection.test.ts (5.205 s)
        PASS  src/tests/key.test.ts (6.034 s)

        Test Suites: 1 failed, 4 passed, 5 total
        Tests:       1 failed, 6 passed, 7 total
        Snapshots:   0 total
        Time:        6.552 s, estimated 7 s
        Ran all test suites matching /src/i.
    ```
