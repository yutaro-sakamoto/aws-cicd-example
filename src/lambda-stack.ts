import * as cdk from 'aws-cdk-lib';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Function(this, 'Function', {
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_22_X,
    });
  }
}