# Demonstration of AWS AppSync API in a federated graphQL setup

This is a project built with CDK for demo purpose and is not meant for production use.

## Deploy

```
npm install
npm run build
cdk deploy
```

## Test

After deployment go to https://studio.apollographql.com/sandbox/explorer and set the endpoint to the one given `FederatedAppsyncApiDemoStack.FederationGatewayApiEndpoint` output of `cdk deploy` command.

## Destroy

```
cdk deploy
```
