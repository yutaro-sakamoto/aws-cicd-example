import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

import * as dotenv from 'dotenv';
dotenv.config();

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'ExamplePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('yutaro-sakamoto/aws-cicd-example', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    })

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'aws-cicd-example-dev', { env: devEnv });
// new MyStack(app, 'aws-cicd-example-prod', { env: prodEnv });

app.synth();