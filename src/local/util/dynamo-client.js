// Create the DynamoDB service client module using ES6 syntax.
const clientDb = require("@aws-sdk/client-dynamodb");
// Create an Amazon DynamoDB service client object.
const ddbClient = new clientDb.DynamoDBClient();
module.exports = { ddbClient };
