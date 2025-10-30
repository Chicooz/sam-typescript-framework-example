import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UseCase } from "../useCases/UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import { DatabaseContractDataProvider } from "../providers/ContractProvider";
import { EnvironmentVariablesProvider } from "../providers/EnvironmentVariablesProvider";
import { Success, NotAuthorised } from "../http/responses/response";

import { CreateContractUseCase } from "../useCases/CreateContractUseCase";
import { SQS } from 'aws-sdk';

const sqs = new SQS();

export const useCase = {
    init: (contract: CreateContractBody): UseCase<string> => {
        const envVarProvider: EnvironmentVariablesProvider = new EnvironmentVariablesProvider();
        const databaseContractProvider = new DatabaseContractDataProvider(envVarProvider);
        const contractRepo = new ContractRepository(databaseContractProvider);
        return new CreateContractUseCase(contract, contractRepo);
    },
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody: CreateContractBody = event.body ? JSON.parse(event.body) : {};
        const contractID = await useCase.init(requestBody).operate();

        // Send message to SQS
        await sqs.sendMessage({
            QueueUrl: process.env.QUEUE_URL, // Ensure this environment variable is set
            MessageBody: JSON.stringify({ contractID }),
        }).promise();

        return new Success({ ContractID: contractID });
    } catch (e) {
        const error = e as Error;
        console.log(error.message);
        return new NotAuthorised(e as Error);
    }
};

export interface CreateContractBody {
    userId?: string;
    contractName?: string;
    templateID?: string;
}