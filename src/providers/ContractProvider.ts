import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    PutCommandInput,
    ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { CreateContractBody } from "../handlers/createContract";
import { EnvironmentVariablesProvider } from "./EnvironmentVariablesProvider";
import crypto from "crypto";
import { DBContractID } from "../handlers/getContractIDs";
export class DatabaseContractDataProvider {
    readonly environmentVariablesProvider: EnvironmentVariablesProvider;
    readonly ddb: DynamoDBDocumentClient;
    readonly tableName: string;

    readonly marshallOptions = {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false, // false, by default.
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: true,
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: false, // false, by default.
    };

    readonly unmarshallOptions = {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false, // false, by default.
    };

    constructor(environmentVariablesProvider: EnvironmentVariablesProvider) {
        this.environmentVariablesProvider = environmentVariablesProvider;
        const dynamdb = new DynamoDBClient({});
        this.ddb = DynamoDBDocumentClient.from(dynamdb, {
            marshallOptions: this.marshallOptions,
            unmarshallOptions: this.unmarshallOptions,
        });
        this.tableName = this.environmentVariablesProvider.getContractsTableName();
    }
    async createContract(contract: CreateContractBody): Promise<string> {
        const params: PutCommandInput = {
            TableName: this.tableName,
            Item: {
                userId: contract.userID,
                contractName: contract.contractName,
                templateID: contract.templateID,
                contractID: crypto.randomUUID(),
            },
        };
        await this.ddb.send(new PutCommand(params));
        return params.Item?.contractID;
    }

    async getContractsIDs(): Promise<DBContractID[]> {
        const params: ScanCommandInput = {
            TableName: this.tableName,
            ProjectionExpression: "contractID",
        };
        const dbResult = await this.ddb.send(new ScanCommand(params));
        console.log(dbResult);
        return dbResult.Items as unknown as DBContractID[];
    }

    async getContract(id: string): Promise<Contract> {
        const params = {
            TableName: this.tableName,
            Key: {
                contractID: id,
            },
        };
        const contract = (await this.ddb.send(new GetCommand(params)))?.Item;

        if (!contract) {
            throw new Error(`Contract '${id}' not found`);
        }

        return contract as Contract;
    }
}

export interface Contract {
    userId: string;
    contractName: string;
    templateID: string;
    contractID: string;
}
