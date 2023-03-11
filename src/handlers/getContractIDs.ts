import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UseCase } from "../useCases/UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import {  DatabaseContractDataProvider } from "../providers/ContractProvider";
import { EnvironmentVariablesProvider } from "../providers/EnvironmentVariablesProvider";
import { Success, NotAuthorised } from "../http/responses/response";

import { GetContractIDsUseCase } from "../useCases/GetContractIDsUseCase";

export const useCase = {
    init: (): UseCase<DBContractID[]> => {
        const envVarProvider: EnvironmentVariablesProvider = new EnvironmentVariablesProvider();
        const databaseContractProvider = new DatabaseContractDataProvider(envVarProvider);
        const contractRepo = new ContractRepository(databaseContractProvider);
        return new GetContractIDsUseCase(contractRepo);
    },
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const contractIDs = await useCase.init().operate();
        return new Success(contractIDs.map( (contract) =>{
            return {
                contractID: contract.contractID.S
            }
        }) as ContractID[]);
    } catch (e) {
        const error = e as Error;
        console.log( error.message)
        return new NotAuthorised(e as Error);
    }
};

export interface ContractID {
    contractID: string;
}

export interface DBContractID {
    contractID: {
        S: string;
    }
}

