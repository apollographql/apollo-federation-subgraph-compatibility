# Federated service hosted on AWS AppSync

## Pre-requisite
* An AWS Account to deploy the AppSync API
* NodeJS

## Deploy

To deploy your own version of this `products` service on AppSync you will need to 

1. deploy the cdk stack:
    ```sh
    cd implementations/appsync/cdk
    npm install
    npm run build && npm run cdk deploy
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