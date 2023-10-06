import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Tracing } from 'aws-cdk-lib/aws-lambda';

import { join } from 'path';

export class ProductsServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'products-service',
      schema: appsync.SchemaFile.fromAsset(join(__dirname, `products-service.graphql`)),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    const lambdaResolver = new lambda.NodejsFunction(this, 'lambdaResolver', {
      entry: join(__dirname, `products-service-resolver.ts`),
      environment: {
        SCHEMA: api.schema.bind(api).definition.replace('__typename: String!', ''),
      },
      tracing: Tracing.ACTIVE,
    });

    const lambdaDS = api.addLambdaDataSource('LambdaDS', lambdaResolver);

    lambdaDS.createResolver('QueryService', {
      typeName: 'Query',
      fieldName: '_service',
    });

    lambdaDS.createResolver('QueryEntities', {
      typeName: 'Query',
      fieldName: '_entities',
    });

    lambdaDS.createResolver('QueryProduct', {
      typeName: 'Query',
      fieldName: 'product'});

    lambdaDS.createResolver('QueryProductCreatedBy', {
      typeName: 'Product',
      fieldName: 'createdBy'
    });

    new cdk.CfnOutput(this, "AppSyncApiEndpoint", {
      value: api.graphqlUrl,
      exportName: "AppSyncApiEndpoint"
    });

    new cdk.CfnOutput(this, "AppSyncApiKey", {
      value: api.apiKey!,
      exportName: "AppSyncApiKey"
    });
  }
}
