# SAM Categories Example using Typescript

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src/handlers` - Code for the application's Handler functions.
- `src/useCases` - Code for the Lambda functions.
- `src/repositories` - Code for internal data repositories.
- `src/providers` - Code for external data providers.
- `src/http/responses` - Code for responses given to users.
- `src/queueProcessor.ts` - Code for processing messages from the Dead Letter Queue (DLQ).
- `__tests__/src` - Unit tests for the application code.
- `template.yaml` - A template that defines the application's AWS resources.
- `swagger` - Contains [Swagger](https://swagger.io/tools/swaggerhub/) definitions for the endpoints exposed by the application.

The application uses several AWS resources, including Lambda functions, an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Initial Setup

After checking out the repository, you'll need to install the following tools:

* [Docker](https://hub.docker.com/search/?type=edition&offering=community).
* [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
* [Act](https://github.com/nektos/act)
* [aws-export-credentials repo](https://github.com/benkehoe/aws-export-credentials)

After installing, configure your AWS environment with your credentials using:

`$ aws configure`

> You can find more information about configuring your environment here: [AWS Configure Basics](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

### Configure AWS Credentials

Then add your credentials to your environment:

on MacOS, append the following lines to your `~/.zshrc` file:

```bash
# AWS Credentials
eval "$(aws-export-credentials --env-export)"
```

> This will allow you to use `make act-deploy`. Without this setup, the command will fail due to lack of credentials.

### Setup Prettier

The project uses [Prettier](https://prettier.io/) to keep the code formatting consistent. The common configuration is placed in `.prettierrc.yaml`. You can run Prettier as an npm script with `npm run pretty` or configure your editor to run it automatically. [Here](https://prettier.io/docs/en/editors.html) you can find integrations with popular editors.

You can also run prettier by invoking:

```bash
$ make pretty
```
or 

```bash
$ npm run pretty
```
or you can pretty commit directly  

```bash
$ npm run commit 'pretty commit'
```
this will also run git add . --all in the background

## Unit tests

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) mocking typescript classes is done through [ts-mokito](https://github.com/NagRock/ts-mockito).

```bash
$ make test
```
or

```bash
$ npm install
$ npm run test
```

### Github Actions

For GitHub Actions to work you have to provide the DEV DEPLOYMENT VARS for the actions to completely test your code. 
You can also emulate the pull request pipeline locally using the *act* command, this can be done by running either:

```bash
$ make act-test
```

or

```bash
$ act pull_request
```

## Deploying the application

The AWS SAM CLI is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To build and deploy your application using Github Actions, all you need to do is to create a new tag with the format `dev/v*` (e.g. `dev/v1.1`) and push it to Github.

## DLQ Replayer

This application includes a Dead Letter Queue (DLQ) replayer that allows you to reprocess messages that have failed to be processed by your Lambda functions. The replayer can be triggered manually or automatically based on your needs.

To use the DLQ replayer, you can invoke the `queueProcessor.ts` Lambda function with the appropriate event structure that contains the messages you wish to reprocess.

Make sure to monitor the logs and metrics in AWS CloudWatch to ensure that the reprocessing is successful.