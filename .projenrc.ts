import { AwsCdkTypeScriptApp } from '@yutaro-sakamoto/projen-cdk';
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  devDeps: ['@yutaro-sakamoto/projen-cdk'],
  name: 'aws-cicd-example',
  projenrcTs: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.addDeps('dotenv');
project.gitignore.addPatterns('.env');
project.synth();