import { Authoriser, IAuthoriser } from "../../../src/authenticate/Authoriser";
import { instance, mock, when } from "ts-mockito";
import { APIGatewayAuthorizerEvent } from "aws-lambda";

import * as lambda from "../../../src/handlers/authorize";

describe("Testing Authorization", () => {
    const event: APIGatewayAuthorizerEvent = {
        type: "TOKEN",
        methodArn: "",
        authorizationToken: "1234",
    };
    const authoriser: IAuthoriser = mock(Authoriser);
    const context = {
        callbackWaitsForEmptyEventLoop: false,
        functionName: "",
        functionVersion: "",
        invokedFunctionArn: "",
        memoryLimitInMB: "",
        awsRequestId: "",
        logGroupName: "",
        logStreamName: "",
        getRemainingTimeInMillis: function (): number {
            throw new Error("Function not implemented.");
        },
        done: function (error?: Error | undefined, result?: any): void {
            throw new Error("Function not implemented.");
        },
        fail: function (error: string | Error): void {
            throw new Error("Function not implemented.");
        },
        succeed: function (messageOrObject: any): void {
            throw new Error("Function not implemented.");
        },
    };
    beforeEach(() => {
        lambda.authoriser.init = event => instance(authoriser);
    });

    it("should attach principal data if user is authorized", async () => {
        when(authoriser.isAuthorised()).thenResolve(true);
        const response = await lambda.handler(event, context, function (err, auth) {
            expect(err).toEqual(undefined);
        });
    });
    it("should return Unauthorized error if user is not authorized", async () => {
        when(authoriser.isAuthorised()).thenReject();
        const response = await lambda.handler(event, context, function (err, auth) {
            expect(err).toEqual("Unauthorized");
        });
    });
});
