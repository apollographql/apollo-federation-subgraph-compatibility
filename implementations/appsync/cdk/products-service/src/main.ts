#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsServiceStack } from './products-service-stack';

const app = new cdk.App();
new ProductsServiceStack(app, 'ProductsServiceStack', {});
