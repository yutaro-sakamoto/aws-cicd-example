import { App, Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, CodeBuildStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import { PipelineAppStage } from './pipeline-app-stage';
import * as iam from 'aws-cdk-lib/aws-iam';


dotenv.config();

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const synthStep = new CodeBuildStep('Synth', {
      input: CodePipelineSource.gitHub('yutaro-sakamoto/aws-cicd-example', 'main'),
      commands: [
        'echo @yutaro-sakamoto:registry=https://npm.pkg.github.com >> ~/.npmrc',
        'echo //npm.pkg.github.com/:_authToken=$(aws ssm get-parameter --name "/cdk/github/npm-auth-token" --with-decryption --query "Parameter.Value" --output text) >> ~/.npmrc',
        'yarn install --check-files',
        'yarn run build',
        'yarn cdk synth'
      ],
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'ExamplePipeline',
      synth: synthStep,
    });

    const testingStage = pipeline.addStage(new PipelineAppStage(this, 'test', {
      env: props.env,
    }));

    testingStage.addPost(new ManualApprovalStep('approval'));

    pipeline.buildPipeline();

    synthStep.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: ['*'],
    }));
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