import { instance, mock, when } from "ts-mockito";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as lambda from "../../../src/handlers/getContractIDs";

import { GetContractIDsUseCase } from "../../../src/useCases/GetContractIDsUseCase";
import { UseCase } from "../../../src/useCases/UseCase";
import { NotAuthorised, Success } from "../../../src/http/responses/response";
import { ContractID, DBContractID } from "../../../src/handlers/getContractIDs";

const fakeEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "POST",
    isBase64Encoded: false,
    path: "/path/to/resource",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
        accountId: "123456789012",
        apiId: "1234567890",
        authorizer: {},
        protocol: "HTTP/1.1",
        httpMethod: "POST",
        identity: {
            accessKey: null,
            accountId: null,
            apiKey: null,
            apiKeyId: null,
            caller: null,
            clientCert: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: "127.0.0.1",
            userArn: null,
            userAgent: "Custom User Agent String",
            user: null,
        },
        path: "/prod/path/to/resource",
        stage: "prod",
        requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
        requestTime: "09/Apr/2015:12:34:56 +0000",
        requestTimeEpoch: 1428582896000,
        resourceId: "123456",
        resourcePath: "/{proxy+}",
    },
    resource: "/{proxy+}",
};
const fakeusecase: UseCase<DBContractID[]> = mock(GetContractIDsUseCase);

const fakeDBContracts: DBContractID[] = [
    {
        contractID: {
            S: "fakeContractID",
        },
    },
    {
        contractID: {
            S: "fakeContractID",
        },
    },
];

const fakeContracts: ContractID[] = [
    {
        contractID: "fakeContractID",
    },
    {
        contractID: "fakeContractID",
    },
];
describe("Testing createContract Handler", () => {
    beforeEach(() => {
        lambda.useCase.init = () => instance(fakeusecase);
    });

    it("should return success if useCase returns token", async () => {
        when(fakeusecase.operate()).thenResolve(fakeDBContracts);
        const response = await lambda.handler(fakeEvent);
        expect(response).toEqual(new Success(fakeContracts));
    });
    it("should return not authorized if useCase returns an error", async () => {
        when(fakeusecase.operate()).thenThrow(new Error("notAuthorized"));
        const response = await lambda.handler(fakeEvent);
        expect(response).toEqual(new NotAuthorised(new Error("notAuthorized")));
    });
});
