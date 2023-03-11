import { Authoriser, IAuthoriser } from "../authenticate/Authoriser";
import {
    Context,
    APIGatewayAuthorizerCallback,
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult,
} from "aws-lambda";
import { UserRepository } from "../repositories/UserRepository";
import { DatabaseUserDataProvider } from "../providers/UserProvider";
import { EnvironmentVariablesProvider } from "../providers/EnvironmentVariablesProvider";
export const authoriser = {
    init: (payload: APIGatewayAuthorizerEvent, repository: UserRepository): IAuthoriser => {
        return new Authoriser(payload, repository);
    },
};

export const handler = async (
    event: APIGatewayAuthorizerEvent,
    _context: Context,
    callback: APIGatewayAuthorizerCallback,
): Promise<any> => {
    try {
        const environmentVariablesProvider = new EnvironmentVariablesProvider();
        const databaseUserProvider = new DatabaseUserDataProvider(environmentVariablesProvider);
        const repository = new UserRepository(databaseUserProvider);
        const userId = await authoriser.init(event, repository).userAuthorized();
        callback(null, generatePolicy(userId, "Allow", event.methodArn));
    } catch (e) {
        const error = e as Error;
        console.log("returning unauthorized due to error: " + error.message);
        return callback("Unauthorized");
    }
};

// Help function to generate an IAM policy
const generatePolicy = function (principalId: string, effect: string, resource: string) {
    const authResponse: APIGatewayAuthorizerResult = {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
    authResponse.context = {
        userId: principalId,
    };
    return authResponse;
};
