import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './pipeline-app-stage';

import * as dotenv from 'dotenv';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

dotenv.config();

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'ExamplePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('yutaro-sakamoto/aws-cicd-example', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    const testingStage = pipeline.addStage(new PipelineAppStage(this, 'test', {
      env: props.env,
    }));

    testingStage.addPost(new ManualApprovalStep('approval'));
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