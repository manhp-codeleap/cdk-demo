#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDemoStack } from '../lib/cdk-demo-stack';

const app = new cdk.App();
new CdkDemoStack(app, 'ManhPCdkDemoStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
