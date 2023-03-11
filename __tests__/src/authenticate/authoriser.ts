import { Authoriser } from "../../../src/authenticate/Authoriser";
import { anything, instance, mock, when } from "ts-mockito";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { APIGatewayAuthorizerEvent } from "aws-lambda";

const repository = mock(UserRepository);
const validEvent: APIGatewayAuthorizerEvent = {
    type: "TOKEN",
    methodArn: "post",
    authorizationToken:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoZXJpZiIsInVzZXJJZCI6IjgzMTQxMzhjLWZmYjMtNGIxOS05NjNiLWI0ZjQ3NDhmODE3ZSIsImlhdCI6MTY3ODQ1MDY1NH0.dXFK_Sc_TV8in_rT-u12eSZN2Yrn0r_rieJvydlMPto",
};
const invalidEvent: APIGatewayAuthorizerEvent = {
    type: "TOKEN",
    methodArn: "post",
    authorizationToken: "BAD TOKEN",
};
const validUser = {
    userId: "8314138c-ffb3-4b19-963b-b4f4748f817e",
    username: "sherif",
    password: "$2a$10$jlFvlg5NWSsHJecI2Ijahu1IQGs1DW.NcK2TtvCcT8grSD/FhMIZi",
    authToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoZXJpZiIsInVzZXJJZCI6IjgzMTQxMzhjLWZmYjMtNGIxOS05NjNiLWI0ZjQ3NDhmODE3ZSIsImlhdCI6MTY3ODQ1MDY1NH0.dXFK_Sc_TV8in_rT-u12eSZN2Yrn0r_rieJvydlMPto",
};
const invalidUser = {
    userId: "BADID",
    username: "sherif",
    password: "$2a$10$jlFvlg5NWSsHJecI2Ijahu1IQGs1DW.NcK2TtvCcT8grSD/FhMIZi",
    authToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoZXJpZiIsInVzZXJJZCI6IjgzMTQxMzhjLWZmYjMtNGIxOS05NjNiLWI0ZjQ3NDhmODE3ZSIsImlhdCI6MTY3ODQ1MDY1NH0.dXFK_Sc_TV8in_rT-u12eSZN2Yrn0r_rieJvydlMPto",
};
describe("Testing Authoriser Class", () => {
    beforeEach(() => {});
    it("getToken should extract correct token from headers", async () => {
        const authoriser = new Authoriser(validEvent, instance(repository));
        const token = await authoriser.getToken();
        expect(token).toEqual(validEvent.authorizationToken.substring(7));
    });
    it("getToken should fail incorrect token ", async () => {
        const authoriser = new Authoriser(invalidEvent, instance(repository));
        try {
            const token = await authoriser.getToken();
        } catch (e) {
            const error = e as Error;
            expect(error.message).toEqual('Invalid Authorization token - BAD TOKEN does not match "Bearer .*"');
        }
    });

    it(" getUserByToken should return userid when provided the correct token", async () => {
        when(repository.getUserByToken(anything())).thenResolve(validUser);
        const authoriser = new Authoriser(validEvent, instance(repository));
        const userId = await authoriser.userAuthorized();
        expect(userId).toEqual(validUser.userId);
    });

    it(" getUserByToken should throw error  provided the incorrect token", async () => {
        when(repository.getUserByToken(anything())).thenResolve(invalidUser);
        const authoriser = new Authoriser(validEvent, instance(repository));
        try {
            const userId = await authoriser.userAuthorized();
        } catch (e) {
            const error = e as Error;
            expect(error.message).toEqual("invalid token");
        }
    });
});
