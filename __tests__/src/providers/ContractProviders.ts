import { mockClient } from "aws-sdk-client-mock";
import {
    GetCommand,
    ScanCommand,
    DynamoDBDocumentClient,
    GetCommandOutput,
    ScanCommandOutput,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import "aws-sdk-client-mock-jest";
import { EnvironmentVariablesProvider } from "../../../src/providers/EnvironmentVariablesProvider";
import { Contract, DatabaseContractDataProvider } from "../../../src/providers/ContractProvider";
import { instance, mock, reset, when } from "ts-mockito";
import { DBContractID } from "../../../src/handlers/getContractIDs";

const ddbMock = mockClient(DynamoDBDocumentClient);
const envVars = mock(EnvironmentVariablesProvider);
const databaseContractProvider = new DatabaseContractDataProvider(instance(envVars));

describe("Test Contract Provider", () => {
    const fakeContractIDs: ScanCommandOutput = {
        Items: [
            {
                contractID: {
                    S: "uuid1",
                },
            },
            {
                contractID: {
                    S: "uuid2",
                },
            },
            {
                contractID: {
                    S: "uuid3",
                },
            },
        ],
        $metadata: {},
    };
    const fakeContract: GetCommandOutput = {
        Item: {
            userId: "uuis",
            contractName: "string",
            templateID: "another string",
            contractID: "uuid",
        },
        $metadata: {},
    };
    beforeEach(() => {
        ddbMock.reset();
        when(envVars.getContractsTableName()).thenReturn("");
        ddbMock.on(PutCommand).resolves(fakeContractIDs);
        ddbMock.on(GetCommand).resolves(fakeContract);
    });

    it("should get contract by id", async () => {
        const contract = await databaseContractProvider.getContract("fakeID");
        expect(contract).toEqual(fakeContract.Item);
    });
    it("should PUT valid contract", async () => {
        const contractId = await databaseContractProvider.createContract(fakeContract.Item!);
        expect(contractId).not.toBeNull();
    });
});
