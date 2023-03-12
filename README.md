# SAM Categories Example using Typescript

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). It includes the following files and folders:

- `src/handlers` - Code for the application's Handler functions.
- `src/useCases` - Code for the Lambda functions.
- `src/repositories` - Code for internal data repositories .
- `src/providers` - Code for external data providers .
- `src/http/responses` - Code for responses given to users .
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

After installing, configure your AWS envrionment with your credentials using:

`$ aws configure`

> You can find more information about configuring your environment here: [AWS Configure Basics](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

### Configure AWS Credentials

Then add your credentials to your enviornment:

on MacOS, append the following lines to your `~/.zshrc` file:

```bash
# AWS Credentials
eval "$(aws-export-credentials --env-export)"
```

> This will allow you to use `make act-deploy`. Without this setup, the command will fail due to lack of credentials.

### Setup Prettier

The project uses [Prettier](https://prettier.io/) keep the code formatting consistent. The common configuration is placed in `.prettierrc.yaml`. You can run Prettier as an npm script with `npm run pretty` or configure your editor to run it automatically. [Here](https://prettier.io/docs/en/editors.html) you can find integrations with popular editors.

You can also run prettier by invoking:

```bash
$ make pretty
```
or 

```bash
$ npm run  pretty
```
or you can pretty commit directly  

```bash
$ npm run commit 'pretty commit'
```
this will also run git add . --all in the background

## Unit tests

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) mocking typescript classes is done through [ts-mokito](https://github.com/NagRock/ts-mockito) .

```bash
$ make test
```
or

```bash
$ npm install
$ npm run test
```

### Github Actions

For GitHub Actions to work you have to provide the DEV DEPLOYMENT VARS for the for actions to be completely test your code. 
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

```bash
git tag dev/v1.1
git push --tags
```

> NOTE: Always tag a release commit from the top of the `main` branch.

You can also deploy locally (assuming you have the correct permissions) using:

```bash
$ make deploy-dev
```

### Inserting your user

you need to insert user manually to be able to login and use the app usiing: 

```bash
$ make insert-user
```

and follow the on screen instructions

### Production

Deployments to production can be done either via a tag (the preferred method):

```bash
git tag prod/v1.1
git push --tags
```

Or locally:

```bash
make deploy-prod
```

> This should only be done locally if absolutely necessary, deploying locally means we don't know what version/state the backend is in, so deployments, especially to **Prod** should always be done via git tags.

You can quickly validate your stack using either:

```bash
$ sam validate
```
or to validate both sam template and swagger 

```bash
make validate
```

You can also deploy using Github's Actions, this emulates the deployment that happens on Github Actions as a result of pushing a tag to Github. This emulation is done by the `act` command which uses a Docker image provided by Github to emulate Github Actions. You can trigger the Github deployment action by using:

```bash
make act-deploy
```

> WARNING: This will deploy to both **Prod** and **Dev**

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.

## Use the AWS SAM CLI to build and test locally

Build your application by using the `sam build` command.

```bash
$ sam build
```

The AWS SAM CLI installs dependencies that are defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.


The AWS SAM CLI can also emulate your application's API. Use the `sam local start-api` command to run the API locally on port 3000.

```bash
$ sam local start-api
$ curl http://localhost:3000/
```

The AWS SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        Api:
          Type: Api
          Properties:
            Path: /
            Method: GET
```
for authenticated only route add the following 

```yaml
      Events:
        Api:
          Type: Api
          Properties:
            Auth:
              Authorizer: Auth0
            Path: /
            Method: GET
```
## Add a resource to your application
The application template uses AWS SAM to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources, such as functions, triggers, and APIs. For resources that aren't included in the [AWS SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use the standard [AWS CloudFormation resource types](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).

Update `template.yaml` to add a dead-letter queue to your application. In the **Resources** section, add a resource named **MyQueue** with the type **AWS::SQS::Queue**. Then add a property to the **AWS::Serverless::Function** resource named **DeadLetterQueue** that targets the queue's Amazon Resource Name (ARN), and a policy that grants the function permission to access the queue.

```
Resources:
  MyQueue:
    Type: AWS::SQS::Queue
  getAllItemsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/handlers/get-all-items.getAllItemsHandler
      Runtime: nodejs16.x
      DeadLetterQueue:
        Type: SQS
        TargetArn: !GetAtt MyQueue.Arn
      Policies:
        - SQSSendMessagePolicy:
            QueueName: !GetAtt MyQueue.QueueName
```

The dead-letter queue is a location for Lambda to send events that could not be processed. It's only used if you invoke your function asynchronously, but it's useful here to show how you can modify your application's resources and function configuration.

Deploy the updated application.

```bash
$ sam deploy
```

Open the [**Applications**](https://console.aws.amazon.com/lambda/home#/applications) page of the Lambda console, and choose your application. When the deployment completes, view the application resources on the **Overview** tab to see the new resource. Then, choose the function to see the updated configuration that specifies the dead-letter queue.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, the AWS SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs that are generated by your Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

**NOTE:** This command works for all Lambda functions, not just the ones you deploy using AWS SAM.

```bash
$ sam logs -n putItemFunction --stack-name sam-app --tail
```

**NOTE:** This uses the logical name of the function within the stack. This is the correct name to use when searching logs inside an AWS Lambda function within a CloudFormation stack, even if the deployed function name varies due to CloudFormation's unique resource name generation.

You can find more information and examples about filtering Lambda function logs in the [AWS SAM CLI documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Cleanup

> ⚠️ WARNING: Do not run this in production 👇🏼🧨

To delete the application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
💥 make destroy-dev
```

You can also destroy the stack using:

```bash
💥 aws cloudformation delete-stack --stack-name testapp-dev
```

## Resources

For an introduction to the AWS SAM specification, the AWS SAM CLI, and serverless application concepts, see the [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).

Next, you can use the AWS Serverless Application Repository to deploy ready-to-use apps that go beyond Hello World samples and learn how authors developed their applications. For more information, see the [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/) and the [AWS Serverless Application Repository Developer Guide](https://docs.aws.amazon.com/serverlessrepo/latest/devguide/what-is-serverlessrepo.html).

## Object Oriented Code patterns

To improve readability and maintainability a few patterns have been added. A breakdown of 
their responsibilities can be found below:

### End Points
The sole responsibility here is to produce a HTTP response, no additional logic should be found here
```typescript
export const handler = async (event: Event): Promise<Response<T>> => {

  const userId = (event.pathParameters as UserPathParameters).userId

  try {
    const body: T = await useCase.init(userId).operate()
    return new Success(body)
  } catch (e) {
    return new ServerError(e as Error)
  }
}
```
The above is very concise and contains a very small code surface area with its result clearly stated  

### Use Cases
This is a support class to the handler and acts as an orquestrator which gathers all the necessary data
from different data sources (see repositories below) and creates the different data states for the
particular use case it supports on the front end. 

Using the end point above as an example, the sole responsibility of this use case, is to return a HouseholdActivity object
which reflects the state of the Household at a given time.

```typescript
public async operate(): Promise<T> {
        // do something
        return TTypeVar:T;
    }
}
```

### Repositories
Repositories are responsible for retrieving a particular domain data entity, a User object, motion status,
settings etc...

The data source can be databases, 3 party APIs or any other source of data provider. Their responsibility
is to retrieve this data and map it into our domain model, following a strict contract of required/optional objects

### Wrappers/Connectors/Providers
In order to satisfy data contracts we should wrap any foreign data source or SDKs in classes we control
so that we maintain a contract between our domain and this provider. Several patterns are well stablished to 
support this.

This can be achieved very simply by creating the following object modelling:
```typescript
export abstract class MotionStatusProvider {
    async provide(groupId: String): Promise<AerialMotionStatus | null> {
        return null
    }
}
```