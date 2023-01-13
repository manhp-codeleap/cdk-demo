import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Distribution, OriginAccessIdentity, OriginBase } from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { ExecSyncOptions, execSync } from 'child_process';
import { Construct } from 'constructs';
import { copySync } from 'fs-extra';
import { join } from 'path';

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create s3
    const websiteBucket = new Bucket(this, `${this.stackName}-shop-bucket`, {
      removalPolicy: RemovalPolicy.RETAIN,
      bucketName: 'cdk-shop-demo',
    });

    // create distribution
    const distribution = new Distribution(
      this,
      `${this.stackName}-shop-distribution`,
      {
        defaultBehavior: {
          origin: new S3Origin(websiteBucket),
        },
        defaultRootObject: 'index.html',
      }
    );
    // create original access identity
    const originalAccess = new OriginAccessIdentity(
      this,
      `${this.stackName}-cf-identity`,
      {
        comment: 'allow access from CF',
      }
    );
    // allow only read access
    websiteBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [websiteBucket.arnForObjects('*')],
        principals: [
          new CanonicalUserPrincipal(
            originalAccess.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );
    // build react app
    const execOptions: ExecSyncOptions = {
      stdio: ['ignore', process.stderr, 'inherit'],
    };

    const appDir = 'packages/FE/App';
    const appAsset = Source.asset(join(__dirname, `../${appDir}`), {
      bundling: {
        image: cdk.DockerImage.fromRegistry('node:14-alpine'),
        command: ['sh', '-c', 'npm i && npm run build'],
        user: 'root',
        local: {
          tryBundle(outputDir: string) {
            execSync(`cd ${appDir} && npm i && npm run build`, execOptions);
            copySync(join(__dirname, `../${appDir}/build`), `${outputDir}`);
            return true;
          },
        },
      },
    });

    // create deployment package
    new BucketDeployment(this, `${this.stackName}-shop-deployment`, {
      destinationBucket: websiteBucket,
      sources: [appAsset],
      distribution: distribution, // this will invalidate the cache
    });

    // create dynamodb table for shop content
    const shopItemsTable = new Table(this, `${this.stackName}-shop-items`, {
      tableName: 'demo-shop-items',
      partitionKey: {
        name: 'id',
        type: AttributeType.NUMBER,
      },
    });
    // add function to get the data from table call getItems
    const getItemsFunction = new NodejsFunction(
      this,
      `${this.stackName}-get-items`,
      {
        bundling: {
          minify: true,
        },
        environment: {
          TABLE_NAME: shopItemsTable.tableName,
        },
        handler: 'handler',
        entry: join(__dirname, '../packages/BE/functions/get-items/index.ts'),
        runtime: Runtime.NODEJS_16_X,
        memorySize: 256,
        timeout: Duration.seconds(30),
        architecture: Architecture.ARM_64,
      }
    );
    // grant the function to scan the table
    shopItemsTable.grantReadData(getItemsFunction);

    // create Api gateway to access the lambda
    const apiGateway = new RestApi(this, `${this.stackName}-shop-gateway`, {
      description: 'Api gateway for demo shop',
      deployOptions: {
        stageName: 'dev',
      },
    });
    const apiResource = apiGateway.root.addResource('api');
    const itemsResource = apiResource.addResource('items');
    itemsResource.addMethod(
      'get',
      new LambdaIntegration(getItemsFunction, { proxy: true })
    );

    // consider using this: @aws-solutions-constructs/aws-cloudfront-apigateway

    // add the behavior /items to distribution
    // add api gateway origin
    const apiOrigin = new RestApiOrigin(apiGateway);
    // this mean every request from s3/api/* will be forward to apiGateway/dev/api/*
    distribution.addBehavior('/api/*', apiOrigin)

    // get output
    // get the output url
    new CfnOutput(this, `${this.stackName}-distribution-url`, {
      value: distribution.distributionDomainName,
    });
    // output api gateway
    new cdk.CfnOutput(this, 'apiUrl', { value: apiGateway.url });
  }
}
