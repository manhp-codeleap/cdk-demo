# deploy app
AWS_PROFILE=manhp-codeleap AWS_REGION=ap-southeast-1 cdk diff
AWS_PROFILE=manhp-codeleap AWS_REGION=ap-southeast-1 cdk synth
AWS_PROFILE=manhp-codeleap AWS_REGION=ap-southeast-1 cdk deploy