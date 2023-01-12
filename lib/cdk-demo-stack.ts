import * as cdk from 'aws-cdk-lib';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
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

    // get the output url
    new CfnOutput(this, `${this.stackName}-distribution-url`, {
      value: distribution.distributionDomainName,
    });
  }
}
