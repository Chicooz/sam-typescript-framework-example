import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UseCase } from "../useCases/UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import {  Contract, DatabaseContractDataProvider } from "../providers/ContractProvider";
import { EnvironmentVariablesProvider } from "../providers/EnvironmentVariablesProvider";
import { Success, NotAuthorised } from "../http/responses/response";

import { GetContractUseCase } from "../useCases/GetContractUseCase";

export const useCase = {
    init: (query: GetContractQuery): UseCase<Contract> => {
        const envVarProvider: EnvironmentVariablesProvider = new EnvironmentVariablesProvider();
        const databaseContractProvider = new DatabaseContractDataProvider(envVarProvider);
        const contractRepo = new ContractRepository(databaseContractProvider);
        return new GetContractUseCase(query, contractRepo);
    },
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const contract = await useCase.init((event.queryStringParameters as GetContractQuery)).operate()
        return new Success(contract);
    }
    catch (e) {
        const error = e as Error;
        console.log( error.message)
        return new NotAuthorised(e as Error);
    }
};

export interface GetContractQuery {
    id?: string;
}

