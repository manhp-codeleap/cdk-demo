# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


# App (Copy from: https://github.com/mamad-1999/Shoping-card-react?ref=reactjsexample.com)

# Build to S3:
1. build app
npm run build
2. create S3
3. copy file
4. create cloud formation distribution & direct to S3 (Remember to update the s3 rule to only allow from CF)

# Next add dynamodb for store the data
