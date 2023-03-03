import { Authoriser, IAuthoriser } from "../authenticate/Authoriser";
import { Context, APIGatewayAuthorizerCallback, APIGatewayAuthorizerEvent } from "aws-lambda";
import { UserRepository } from "../repositories/UserRepository";
import { DatabaseUserDataProvider } from "../providers/UserProviders";
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
        const isAuthorised = await authoriser.init(event, repository).isAuthorised();
        if (isAuthorised) {
            return callback();
        } else {
            return callback("Unauthorized");
        }
    } catch (e) {
        const error = e as Error;
        console.log("returning unauthorized due to error: " + error.message);
        return callback("Unauthorized");
    }
};
