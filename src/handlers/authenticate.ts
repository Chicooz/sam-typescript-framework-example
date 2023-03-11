import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UseCase } from "../useCases/UseCase";
import { UserRepository } from "../repositories/UserRepository";
import { DatabaseUserDataProvider } from "../providers/UserProvider";
import { PasswordProvider } from "../providers/PasswordProvider";
import { EnvironmentVariablesProvider } from "../providers/EnvironmentVariablesProvider";
import { Success, NotAuthorised } from "../http/responses/response";

import { AuthenticateUserUseCase } from "../useCases/AuthenticateUseCase";

export const useCase = {
    init: (user: AuthenticateBody): UseCase<string | null> => {
        const envVarProvider: EnvironmentVariablesProvider = new EnvironmentVariablesProvider();
        const databaseUserProvider = new DatabaseUserDataProvider(envVarProvider);
        const userRepo = new UserRepository(databaseUserProvider);
        const passwordProvider = new PasswordProvider();
        return new AuthenticateUserUseCase(user, userRepo, passwordProvider);
    },
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody: AuthenticateBody = event.body ? JSON.parse(event.body) : {};
        const token = await useCase.init(requestBody).operate();
        return new Success({token});
    } catch (e) {
        const error = e as Error;
        return new NotAuthorised(e as Error);
    }
};

export interface AuthenticateBody {
    username?: string;
    password?: string;
}
