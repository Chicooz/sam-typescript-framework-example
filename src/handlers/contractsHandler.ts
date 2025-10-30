import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreateContractBody } from "./createContract";
import { GetContractQuery } from "./getContract";
import { ContractID, DBContractID } from "./getContractIDs";
import { UseCase } from "../useCases/UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import { DatabaseContractDataProvider } from "../providers/ContractProvider";
import { EnvironmentVariablesProvider } from "../providers/EnvironmentVariablesProvider";
import { Success, NotAuthorised } from "../http/responses/response";
import { CreateContractUseCase } from "../useCases/CreateContractUseCase";
import { GetContractIDsUseCase } from "../useCases/GetContractIDsUseCase";
import { GetContractUseCase } from "../useCases/GetContractUseCase";
import { SQS } from 'aws-sdk';

const sqs = new SQS();

const envVarProvider: EnvironmentVariablesProvider = new EnvironmentVariablesProvider();
const databaseContractProvider = new DatabaseContractDataProvider(envVarProvider);
const contractRepo = new ContractRepository(databaseContractProvider);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const path = event.path;
    try {
        switch (path) {
            case '/createContract':
                const createRequestBody: CreateContractBody = event.body ? JSON.parse(event.body) : {};
                const contractID = await new CreateContractUseCase(createRequestBody, contractRepo).operate();

                // Send message to SQS
                await sqs.sendMessage({
                    QueueUrl: process.env.QUEUE_URL, // Ensure this environment variable is set
                    MessageBody: JSON.stringify({ contractID }),
                }).promise();

                return new Success({ ContractID: contractID });

            case '/getContractIDs':
                const contractIDs = await new GetContractIDsUseCase(contractRepo).operate();
                return new Success(
                    contractIDs.map(contract => {
                        return {
                            contractID: contract.contractID.S,
                        };
                    }) as ContractID[],
                );

            case '/getContract':
                const contract = await new GetContractUseCase(event.queryStringParameters as GetContractQuery, contractRepo).operate();
                return new Success(contract);

            default:
                return new NotAuthorised(new Error("Invalid endpoint"));
        }
    } catch (e) {
        const error = e as Error;
        console.log(error.message);
        return new NotAuthorised(error);
    }
};