const lambda = require("../../../src/handlers/all.js");

describe("catchall Router", () => {
    it("should return 200 ", async () => {
        const result = await lambda.handler({});
        expect(result.statusCode).toEqual(200);
    });
});
